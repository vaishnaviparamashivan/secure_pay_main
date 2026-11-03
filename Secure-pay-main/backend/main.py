from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
import joblib
import os
import pandas as pd
import numpy as np

# DB and Auth Configuration
from database import get_db, db
from auth import get_password_hash, verify_password, create_access_token, get_current_user

# Schemas and Routers
from schemas import UserCreate, TransactionCreate, SupportTicketCreate, UserResponse, TransactionResponse, SupportTicketResponse, Token
from routers import admin

app = FastAPI(title="SECURE PAY API", description="AI Powered Secure Payments with Random Forest & XGBoost")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router, prefix="/admin", tags=["admin"])

# Load Machine Learning Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fraud_model.pkl')
try:
    fraud_model = joblib.load(MODEL_PATH)
except:
    fraud_model = None
    print("Warning: ML Model not found. Please run train_model.py")

class LoginRequest(BaseModel):
    username: str
    password: str

# Helper to format MongoDB document IDs
def format_mongo_doc(doc):
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

@app.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, local_db = Depends(get_db)):
    existing_user = local_db.users.find_one({"$or": [{"username": user.username}, {"upi_id": user.upi_id}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or UPI ID already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict(exclude={"password"})
    user_dict["password"] = hashed_password
    user_dict["role"] = user.role or "USER"

    result = local_db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

@app.post("/login", response_model=Token)
def login(req: LoginRequest, local_db = Depends(get_db)):
    user = local_db.users.find_one({"username": req.username})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer", "upi_id": user["upi_id"], "role": user["role"]}

import hashlib

def preprocess_transaction(tx: TransactionCreate):
    # Mapping transaction to ML model inputs without relying on rule-based proxies
    hash_val = int(hashlib.md5(tx.device_id.encode()).hexdigest(), 16)
    device_score = (hash_val % 100) / 100.0  # Normalized score 0.0 to 0.99
    is_weekend = datetime.now().weekday() >= 5
    time_of_day = datetime.now().hour
    
    return pd.DataFrame({
        'amount': [tx.amount],
        'device_score': [device_score],
        'is_weekend': [int(is_weekend)],
        'time_of_day': [time_of_day]
    })

@app.post("/transactions", response_model=TransactionResponse)
def create_transaction(tx: TransactionCreate, current_user = Depends(get_current_user), local_db = Depends(get_db)):
    if current_user["upi_id"] != tx.sender_upi:
        raise HTTPException(status_code=403, detail="Not authorized to send from this UPI")

    # Check recipient registration
    recipient = local_db.users.find_one({"upi_id": tx.recipient_upi})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient UPI ID not registered")

    risk_level = "LOW"
    reason = None
    
    if tx.amount > 100000:
        risk_level = "HIGH"
        reason = "UPI payment limit is only upto one lakh max"
    elif "fraud" in tx.recipient_upi.lower():
        if tx.amount < 10000:
            risk_level = "MEDIUM"
            reason = "Warning: Recipient account has suspicious patterns (known fraud threat)"
        else:
            risk_level = "HIGH"
            reason = "Critical Warning: Recipient is a verified fraudster"
    else:
        if not fraud_model:
            raise HTTPException(status_code=500, detail="Machine Learning model is offline.")

        record_df = preprocess_transaction(tx)
        fraud_probability = fraud_model.predict_proba(record_df)[0][1]
        
        if fraud_probability > 0.7:
            risk_level = "HIGH"
            reason = f"Ensemble AI Model flagged transaction (Confidence: {fraud_probability:.2%})"
        elif fraud_probability > 0.4:
            risk_level = "MEDIUM"
            reason = f"Suspicious transaction pattern detected (Confidence: {fraud_probability:.2%})"

    tx_dict = tx.dict()
    tx_dict["date"] = datetime.utcnow()
    tx_dict["risk_level"] = risk_level
    tx_dict["reason"] = reason

    result = local_db.transactions.insert_one(tx_dict)
    tx_dict["_id"] = str(result.inserted_id)
    return tx_dict

@app.get("/transactions/{upi_id}", response_model=list[TransactionResponse])
def get_user_transactions(upi_id: str, current_user = Depends(get_current_user), local_db = Depends(get_db)):
    if current_user["role"] != "ADMIN" and current_user["upi_id"] != upi_id:
         raise HTTPException(status_code=403, detail="Cannot access transactions of other users")

    cursor = local_db.transactions.find({"$or": [{"sender_upi": upi_id}, {"recipient_upi": upi_id}]}).sort("date", -1)
    return [format_mongo_doc(doc) for doc in cursor]

@app.post("/tickets", response_model=SupportTicketResponse)
def create_ticket(ticket: SupportTicketCreate, current_user = Depends(get_current_user), local_db = Depends(get_db)):
    ticket_dict = ticket.dict()
    ticket_dict["status"] = "OPEN"
    ticket_dict["date"] = datetime.utcnow()
    
    result = local_db.tickets.insert_one(ticket_dict)
    ticket_dict["_id"] = str(result.inserted_id)
    return ticket_dict

@app.get("/tickets/{upi_id}", response_model=list[SupportTicketResponse])
def get_user_tickets(upi_id: str, current_user = Depends(get_current_user), local_db = Depends(get_db)):
    if current_user["role"] != "ADMIN" and current_user["upi_id"] != upi_id:
         raise HTTPException(status_code=403, detail="Cannot access tickets of other users")

    cursor = local_db.tickets.find({"upi_id": upi_id}).sort("date", -1)
    return [format_mongo_doc(doc) for doc in cursor]
