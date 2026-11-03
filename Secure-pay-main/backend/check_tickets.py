from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017")
db = client["secure_pay_db"]
print("Tickets in DB:", db.tickets.count_documents({}))
for t in db.tickets.find().sort("date", -1).limit(5):
    print(t)
