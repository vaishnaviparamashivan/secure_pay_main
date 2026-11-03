import pymongo
import datetime

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["secure_pay_db"]
now = datetime.datetime.utcnow()
count = 0
for t in db.tickets.find():
    if t.get("date") and t["date"] > now:
        db.tickets.update_one({"_id": t["_id"]}, {"$set": {"date": t["date"] - datetime.timedelta(hours=24)}})
        count += 1
print(f"Fixed {count} future tickets.")
