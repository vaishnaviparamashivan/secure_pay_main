from pymongo import MongoClient
from bson.objectid import ObjectId

db = MongoClient("mongodb://localhost:27017")["secure_pay_db"]
t = db.tickets.find_one({"status": "OPEN"})
print("Before update status:", t["status"])
result = db.tickets.find_one_and_update(
    {"_id": t["_id"]},
    {"$set": {"status": "RESOLVED"}},
    return_document=True
)
print("After update status returned:", result["status"])
