
from pydantic import BaseModel, ConfigDict
from datetime import datetime


# ---------- USER SCHEMAS ----------

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)


# ---------- EVENT SCHEMAS ----------

class EventCreate(BaseModel):
    title: str
    description: str | None = None
    event_date: datetime


class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    event_date: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# ---------- TASK SCHEMAS ----------

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "pending"
    priority: str = "medium"
    deadline: datetime | None = None
    event_id: int


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    deadline: datetime | None
    event_id: int

    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    

class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    event_date: datetime | None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    deadline: datetime | None = None
