from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255))
    completed = Column(Boolean, default=False)

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