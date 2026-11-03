from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from auth import get_current_user
from schemas import TransactionResponse, UserResponse, SupportTicketResponse, TicketResolveRequest

router = APIRouter()

def format_mongo_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

@router.get("/transactions", response_model=list[TransactionResponse])
def get_all_transactions(current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only access")
    cursor = db.transactions.find().sort("date", -1)
    return [format_mongo_doc(doc) for doc in cursor]

@router.get("/transactions/high-risk", response_model=list[TransactionResponse])
def get_high_risk_transactions(current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only access")
    cursor = db.transactions.find({"risk_level": "HIGH"}).sort("date", -1).limit(50)
    return [format_mongo_doc(doc) for doc in cursor]

@router.get("/users", response_model=list[UserResponse])
def get_all_users(current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only access")
    cursor = db.users.find().limit(30)
    return [format_mongo_doc(doc) for doc in cursor]

@router.get("/tickets", response_model=list[SupportTicketResponse])
def get_all_tickets(current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only access")
    cursor = db.tickets.find().sort("date", -1)
    return [format_mongo_doc(doc) for doc in cursor]

@router.put("/tickets/{ticket_id}/resolve", response_model=SupportTicketResponse)
def resolve_ticket(ticket_id: str, req: TicketResolveRequest, current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only access")
    
    from bson.objectid import ObjectId
    try:
        obj_id = ObjectId(ticket_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ticket id")

    result = db.tickets.find_one_and_update(
        {"_id": obj_id},
        {"$set": {"status": "RESOLVED", "admin_response": req.admin_response}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return format_mongo_doc(result)


@router.get("/user-transactions/{upi_id}", response_model=list[TransactionResponse])
def search_user_transactions(upi_id: str, current_user = Depends(get_current_user), db = Depends(get_db)):
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin only access")
    cursor = db.transactions.find({"$or": [{"sender_upi": upi_id}, {"recipient_upi": upi_id}]}).sort("date", -1)
    return [format_mongo_doc(doc) for doc in cursor]
