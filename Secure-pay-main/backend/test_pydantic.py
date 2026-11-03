from schemas import SupportTicketResponse
from datetime import datetime

t = {
    "_id": "69ad1ef8838fff6fd2040231",
    "upi_id": "location1@fraudbank",
    "subject": "Change my linked phone number",
    "description": "I am facing an issue regarding: Change my linked phone number. Please fix it ASAP.",
    "status": "OPEN",
    "date": datetime.utcnow()
}

resp = SupportTicketResponse(**t)
print(resp.model_dump(by_alias=True) if hasattr(resp, 'model_dump') else resp.dict(by_alias=True))
