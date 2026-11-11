from router import tasks
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from router import events
from router import auth
from router import dashboard
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Event Task Manager"
)
app = FastAPI(title="Event Task Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://event-task-manager-rosyvercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)

@app.get("/")
def home():
    return {"message": "Event Task Manager API is running"}
