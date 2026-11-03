from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    upi_id: str
    role: Optional[str] = "USER"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

class TransactionCreate(BaseModel):
    sender_upi: str
    recipient_upi: str
    amount: float
    device_id: Optional[str] = "default_device"

class TransactionResponse(BaseModel):
    id: str = Field(alias="_id")
    date: datetime
    sender_upi: str
    recipient_upi: str
    amount: float
    risk_level: str
    device_id: str
    reason: Optional[str] = None

    class Config:
        populate_by_name = True

class SupportTicketCreate(BaseModel):
    upi_id: str
    subject: str
    description: str

class SupportTicketResponse(SupportTicketCreate):
    id: str = Field(alias="_id")
    status: str
    admin_response: Optional[str] = None
    date: Optional[datetime] = None

class TicketResolveRequest(BaseModel):
    admin_response: str

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str
    upi_id: str
    role: str
