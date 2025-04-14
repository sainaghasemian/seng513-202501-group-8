from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import Base, SessionLocal, engine
from models import Task, User, Course, ShareToken
from pydantic import BaseModel
from datetime import datetime
from dateutil.parser import parse
from fastapi.middleware.cors import CORSMiddleware
import secrets, json

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
    allow_origins=["http://localhost:3000"], 
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

# Schemas
class TaskSchema(BaseModel):
    text: str
    course: str
    tag: str
    deadline: datetime
    due_date: str
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

class UserUpdate(BaseModel):
    time_format: bool
    notifications: bool

class CourseSchema(BaseModel):
    name: str
    color: str

class CourseOut(CourseSchema):
    id: int
    class Config:
        orm_mode = True

# Routes
@app.get("/courses", response_model=list[CourseOut])
def get_courses(db: Session = Depends(get_db), user=Depends(verify_firebase_token)):
    return db.query(Course).filter(Course.user_id == user["uid"]).all()

@app.post("/courses", response_model=CourseOut)
def add_course(course: CourseSchema, db: Session = Depends(get_db), user=Depends(verify_firebase_token)):
    db_course = Course(name=course.name, color=course.color, user_id=user["uid"])
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/tasks", response_model=list[TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)
):
    return db.query(Task).filter(Task.user_id == user["uid"]).all()

@app.post("/tasks", response_model=TaskOut)
def create_task(
    task: TaskSchema,
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token)
):    
    try:
        parsed_deadline = (
        datetime.fromisoformat(task.deadline.replace("Z", ""))
        if isinstance(task.deadline, str) else task.deadline
    )

        db_task = Task(
            text      = task.text,
            course    = task.course,
            tag       = task.tag,
            deadline  = parsed_deadline,
            due_date  = task.due_date,
            completed = task.completed,
            user_id   = user["uid"],
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)

        return db_task
    except Exception as e:
        print("Error creating task:", e)
        raise HTTPException(status_code=500, detail="Task creation failed")


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

@app.patch("/users/settings")
def update_user_settings(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token),
):
    db_user = db.query(User).filter(User.uid == user["uid"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.time_format = user_data.time_format
    db_user.notifications = user_data.notifications
    db.commit()
    db.refresh(db_user)
    return {"message": "User settings updated successfully"}

@app.get("/users/settings")
def get_user_settings(
    db: Session = Depends(get_db),
    user=Depends(verify_firebase_token),
):
    db_user = db.query(User).filter(User.uid == user["uid"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "time_format": db_user.time_format,
        "notifications": db_user.notifications,
    }

# Create share link
@app.post("/share-schedule")
def share_schedule(
    body: dict = Body(...),             # expects {"courses": [..]}
    db: Session = Depends(get_db),
    user = Depends(verify_firebase_token)
):
    if "courses" not in body or not isinstance(body["courses"], list):
        raise HTTPException(400, detail="courses must be a list")

    token = secrets.token_urlsafe(16)
    db_token = ShareToken(
        token     = token,
        owner_uid = user["uid"],
        courses   = json.dumps(body["courses"])
    )
    db.add(db_token)
    db.commit()
    return { "token": token }

@app.get("/shared/{token}")
def get_shared_calendar(token: str, db: Session = Depends(get_db)):
    tok = db.query(ShareToken).filter_by(token=token).first()
    if not tok:
        raise HTTPException(404, detail="Link not found")

    # pull all tasks that belong to owner & match the allowed courses
    allowed = json.loads(tok.courses)
    tasks = (
        db.query(Task)
        .filter(Task.user_id == tok.owner_uid, Task.course.in_(allowed))
        .all()
    )
    return [
        {
            "title": t.text,
            "date" : t.due_date   # FullCalendar accepts YYYY-MM-DD
        }
        for t in tasks
    ]

@app.get("/init-db")
def init_db():
    Base.metadata.create_all(bind=engine)
    return {"message": "Tables created"}

# Initialize DB
Base.metadata.create_all(bind=engine)
