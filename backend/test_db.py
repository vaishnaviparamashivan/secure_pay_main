from pymongo import MongoClient
db = MongoClient("mongodb://localhost:27017")["secure_pay_db"]
for t in db.tickets.find().sort("date", -1).limit(5):
    print(t)
