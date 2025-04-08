from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import Base, SessionLocal, engine
from models import Task, User
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Firebase
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Body

# Initialize Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

# FastAPI App
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Token Auth Dependency
security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = firebase_auth.verify_id_token(credentials.credentials)
        return decoded_token  # Contains 'uid', 'email', etc.
    except Exception as e:
        raise HTTPException(status_code=403, detail="Invalid Firebase ID token")

# DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class TaskSchema(BaseModel):
    text: str
    completed: bool = False

class TaskOut(TaskSchema):
    id: int
    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    completed: bool

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    school: str

# Routes
@app.get("/tasks", response_model=list[TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)  # Protect this route
):
    return db.query(Task).all()

@app.post("/tasks", response_model=TaskOut)
def create_task(
    task: TaskSchema,
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)
):
    db_task = Task(text=task.text, completed=task.completed)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/tasks/{task_id}", response_model=dict)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = task_data.completed
    db.commit()
    db.refresh(task)
    return {"id": task.id, "text": task.text, "completed": task.completed}

@app.post("/users")
def create_user(
    user_data: UserCreate,
    user=Depends(verify_firebase_token),
    db: Session = Depends(get_db),
):
    try:
        # Using ORM to create the user
        new_user = User(
            uid=user["uid"],
            email=user.get("email", ""),
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            school=user_data.school,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created successfully", "user_id": new_user.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Initialize DB
Base.metadata.create_all(bind=engine)
