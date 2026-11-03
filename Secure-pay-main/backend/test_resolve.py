import urllib.request
import json

req1 = urllib.request.Request("http://localhost:8000/login", data=json.dumps({"username": "admin", "password": "password"}).encode(), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req1) as f:
    token = json.loads(f.read().decode()).get("access_token")

ticket_id = "69ad1ef8838fff6fd2040231"
req_data = json.dumps({"admin_response": "Test manual resolve"}).encode()
req2 = urllib.request.Request(f"http://localhost:8000/admin/tickets/{ticket_id}/resolve", data=req_data, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}, method="PUT")

try:
    with urllib.request.urlopen(req2) as f:
        print(f.status)
        print(f.read().decode())
except Exception as e:
    print(e.read().decode())
