import urllib.request
import json

req1 = urllib.request.Request("http://localhost:8000/login", data=json.dumps({"username": "admin", "password": "password"}).encode(), headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req1) as f:
    token = json.loads(f.read().decode()).get("access_token")

req2 = urllib.request.Request("http://localhost:8000/admin/tickets", headers={"Authorization": f"Bearer {token}"})
with urllib.request.urlopen(req2) as f:
    print(f.read().decode()[:500])
