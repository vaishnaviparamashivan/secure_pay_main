import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from database import engine, SessionLocal
import models
from datetime import datetime, timedelta
import random

models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # 1. Admin
    admin = models.User(username="admin", upi_id="admin@upi", password="password", role="ADMIN")
    db.add(admin)
    
    # Normal users
    normal_users = []
    for i in range(1, 11):
        u = models.User(username=f"normal_user_{i}", upi_id=f"normal{i}@okicici", password="password", role="USER")
        db.add(u)
        normal_users.append(u)
    
    # Fraud users
    # Velocity
    velocity_users = []
    for i in range(1, 6):
        u = models.User(username=f"velocity_fraud_{i}", upi_id=f"velocity{i}@badbank", password="password", role="USER")
        db.add(u)
        velocity_users.append(u)
        
    # Location
    location_users = []
    for i in range(1, 6):
        u = models.User(username=f"location_fraud_{i}", upi_id=f"location{i}@badbank", password="password", role="USER")
        db.add(u)
        location_users.append(u)
        
    # Timing
    timing_users = []
    for i in range(1, 6):
        u = models.User(username=f"timing_fraud_{i}", upi_id=f"timing{i}@badbank", password="password", role="USER")
        db.add(u)
        timing_users.append(u)
        
    db.commit()

    users_all = db.query(models.User).all()
    
    # Seed transactions
    now = datetime.utcnow()
    # High risk for velocity
    velocity_upi_1 = velocity_users[0].upi_id
    for i in range(20):
        t = models.Transaction(
            date=now - timedelta(minutes=i),
            sender_upi=velocity_upi_1,
            recipient_upi=f"dummy{i}@okicici",
            amount=round(random.uniform(100.0, 3000.0), 2),
            risk_level="HIGH" if 1000 <= round(random.uniform(100.0, 3000.0), 2) <= 25000 else "LOW",
            device_id="device_vel_1",
            reason="velocity fraud"
        )
        db.add(t)

    # Adding the big high risk transactions shown in the screenshot
    db.add(models.Transaction(date=datetime.strptime("01/03/2026, 17:22:27", "%d/%m/%Y, %H:%M:%S"), sender_upi="hello@hdfc", recipient_upi=velocity_upi_1, amount=25000.00, risk_level="HIGH", device_id="e6c3a94962d552d773670a7ce34fcd4b", reason="new/unrecognized device"))
    db.add(models.Transaction(date=datetime.strptime("01/03/2026, 16:38:54", "%d/%m/%Y, %H:%M:%S"), sender_upi="testone@sbi", recipient_upi=velocity_upi_1, amount=10002.00, risk_level="HIGH", device_id="e6c3a94962d552d773670a7ce34fcd4b", reason="new/unrecognized device"))
    db.add(models.Transaction(date=datetime.strptime("01/03/2026, 16:33:21", "%d/%m/%Y, %H:%M:%S"), sender_upi="hemanth@sbi", recipient_upi=velocity_upi_1, amount=20000.00, risk_level="HIGH", device_id="e6c3a94962d552d773670a7ce34fcd4b", reason="new/unrecognized device"))
    db.add(models.Transaction(date=datetime.strptime("01/03/2026, 16:16:49", "%d/%m/%Y, %H:%M:%S"), sender_upi="admin@upi", recipient_upi=velocity_upi_1, amount=3000.00, risk_level="HIGH", device_id="e6c3a94962d552d773670a7ce34fcd4b", reason="new/unrecognized device"))

    db.add(models.SupportTicket(upi_id="61d1a7", subject="error", description="erroe found", status="RESOLVED"))

    db.commit()
    db.close()
    print("Database seeded completely!")

if __name__ == "__main__":
    seed_data()
