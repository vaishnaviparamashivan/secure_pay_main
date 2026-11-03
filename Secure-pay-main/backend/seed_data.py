import pymongo
from pymongo import MongoClient
import random
from datetime import datetime, timedelta
import os
import sys

# Append the current dir to sys.path to import auth
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from auth import get_password_hash

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client["secure_pay_db"]

def clear_db():
    print("Clearing existing users, transactions, and tickets...")
    db.users.delete_many({"role": "USER"}) # don't delete admin
    db.transactions.delete_many({})
    db.tickets.delete_many({})

def get_random_date(start_days_ago, end_days_ago, hour_start, hour_end):
    days = random.randint(end_days_ago, start_days_ago)
    hour = random.randint(hour_start, hour_end)
    minute = random.randint(0, 59)
    dt = datetime.utcnow() - timedelta(days=days)
    return dt.replace(hour=hour, minute=minute, second=random.randint(0,59))

def seed():
    clear_db()
    
    users = []
    
    # Generate 18 Good Accounts
    print("Generating 18 Good Accounts...")
    for i in range(1, 19):
        username = f"gooduser{i}"
        upi = f"{username}@okbank"
        users.append({
            "username": username,
            "upi_id": upi,
            "password": get_password_hash("password123"),
            "role": "USER",
            "type": "good"
        })

    # Generate 6 Velocity Fraud Accounts
    print("Generating 6 Velocity Fraud Accounts...")
    for i in range(1, 7):
        username = f"velocity{i}"
        upi = f"{username}@fraudbank"
        users.append({
            "username": username,
            "upi_id": upi,
            "password": get_password_hash("password123"),
            "role": "USER",
            "type": "velocity"
        })

    # Generate 6 Location Fraud Accounts
    print("Generating 6 Location Fraud Accounts...")
    for i in range(1, 7):
        username = f"location{i}"
        upi = f"{username}@fraudbank"
        users.append({
            "username": username,
            "upi_id": upi,
            "password": get_password_hash("password123"),
            "role": "USER",
            "type": "location"
        })

    # Generate 6 Timing Fraud Accounts
    print("Generating 6 Timing Fraud Accounts...")
    for i in range(1, 7):
        username = f"timing{i}"
        upi = f"{username}@fraudbank"
        users.append({
            "username": username,
            "upi_id": upi,
            "password": get_password_hash("password123"),
            "role": "USER",
            "type": "timing"
        })

    # Insert users
    db.users.insert_many([ {k:v for k,v in u.items() if k != "type"} for u in users ])
    
    transactions = []
    
    all_upis = [u['upi_id'] for u in users]
    
    for u in users:
        upi = u['upi_id']
        u_type = u['type']
        
        if u_type == "good":
            # 30+ transactions
            num_tx = random.randint(31, 45)
            for _ in range(num_tx):
                recipient = random.choice([x for x in all_upis if x != upi])
                amount = random.randint(100, 20000)
                risk = "LOW"
                reason = None
                
                # occasional >1L transaction
                if random.random() < 0.05:
                    amount = random.randint(101000, 150000)
                    risk = "HIGH"
                    reason = "UPI payment limit is only upto one lakh max"

                transactions.append({
                    "date": get_random_date(30, 0, 8, 20),
                    "sender_upi": upi,
                    "recipient_upi": recipient,
                    "amount": round(float(amount), 2),
                    "risk_level": risk,
                    "device_id": f"device_{upi}_main",
                    "reason": reason
                })

        elif u_type == "velocity":
            # 40+ transactions in a short time
            num_tx = random.randint(41, 55)
            base_date = get_random_date(5, 0, 10, 16)
            for j in range(num_tx):
                recipient = random.choice([x for x in all_upis if x != upi])
                amount = random.randint(500, 5000)
                # transactions within minutes of each other
                tx_date = base_date + timedelta(minutes=j*2)
                transactions.append({
                    "date": tx_date,
                    "sender_upi": upi,
                    "recipient_upi": recipient,
                    "amount": round(float(amount), 2),
                    "risk_level": "HIGH",
                    "device_id": f"device_{upi}_main",
                    "reason": "Ensemble AI Model flagged transaction (Confidence: 85.00%) - Velocity anomaly"
                })

        elif u_type == "location":
            num_tx = random.randint(41, 55)
            for _ in range(num_tx):
                recipient = random.choice([x for x in all_upis if x != upi])
                amount = random.randint(1000, 15000)
                transactions.append({
                    "date": get_random_date(30, 0, 8, 20),
                    "sender_upi": upi,
                    "recipient_upi": recipient,
                    "amount": round(float(amount), 2),
                    "risk_level": "HIGH",
                    "device_id": f"device_random_{random.randint(1,100)}",
                    "reason": "Suspicious transaction pattern detected (Confidence: 65.00%) - Geographic anomaly"
                })

        elif u_type == "timing":
            num_tx = random.randint(41, 55)
            for _ in range(num_tx):
                recipient = random.choice([x for x in all_upis if x != upi])
                amount = random.randint(10000, 95000)
                transactions.append({
                    "date": get_random_date(30, 0, 1, 4), # 1 AM to 4 AM
                    "sender_upi": upi,
                    "recipient_upi": recipient,
                    "amount": round(float(amount), 2),
                    "risk_level": "HIGH",
                    "device_id": f"device_{upi}_main",
                    "reason": "Ensemble AI Model flagged transaction (Confidence: 92.00%) - Timing anomaly"
                })
    
    print(f"Inserting {len(transactions)} transactions...")
    db.transactions.insert_many(transactions)

    print("Generating over 30 random support tickets...")
    tickets = []
    issues = [
        "Payment deducted but not received by merchant",
        "Unable to reset UPI pin",
        "High risk flag triggered incorrectly",
        "Cashback not credited",
        "App keeps crashing when I open scanner",
        "Change my linked phone number",
        "How do I increase my transaction limit?",
        "Suspicious transaction alert check",
        "Refund status is stuck",
        "Double deduction on last payment"
    ]
    
    # Generate 30+ tickets distributed among random users
    num_tickets = random.randint(35, 45)
    for _ in range(num_tickets):
        u = random.choice(users)
        subject = random.choice(issues)
        is_resolved = random.choice([True, False])
        
        ticket = {
            "upi_id": u["upi_id"],
            "subject": subject,
            "description": f"I am facing an issue regarding: {subject}. Please fix it ASAP.",
            "status": "RESOLVED" if is_resolved else "OPEN",
            "date": get_random_date(10, 0, 9, 18)
        }
        
        if is_resolved:
            ticket["admin_response"] = f"Dear User, your issue regarding '{subject}' has been investigated and resolved successfully. Let us know if further help is needed."
            
        tickets.append(ticket)
        
    db.tickets.insert_many(tickets)
    print(f"Inserted {len(tickets)} tickets.")

    print("Seed complete!")

if __name__ == "__main__":
    seed()
