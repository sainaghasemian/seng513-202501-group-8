from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(128), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    school = Column(String(255))
    time_format = Column(Boolean, default=True)  # True for 12H, False for 24H
    notifications = Column(Boolean, default=True)  # True for enabled, False for disabled
    
    tasks = relationship("Task", back_populates="user")
    courses = relationship("Course", back_populates="user")

class SystemSettingModel(Base):
    __tablename__ = "system_settings"
    key     = Column(String(50), primary_key=True)        # VARCHAR requires length in MySQL
    enabled = Column(Boolean, nullable=False, default=False)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255))
    course = Column(String(100))
    tag = Column(String(100))
    deadline = Column(DateTime)
    due_date = Column(String(50))
    completed = Column(Boolean, default=False)

    user_id = Column(String(128), ForeignKey("users.uid"))
    user = relationship("User", back_populates="tasks")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    color = Column(String(7))  # hex color string like #abcdef

    user_id = Column(String(128), ForeignKey("users.uid"))
    user = relationship("User", back_populates="courses")

class ShareToken(Base):
    __tablename__ = "share_tokens"
    id        = Column(Integer, primary_key=True, index=True)
    token     = Column(String(64), unique=True, index=True, nullable=False)
    owner_uid = Column(String(128), ForeignKey("users.uid"))
    # store JSON list of course names (["ENEL 500", ...])
    courses   = Column(Text, nullable=False)
    created   = Column(DateTime, default=datetime.utcnow)