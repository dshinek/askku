from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import schema, crud, database
from db.database import get_db
import os
import redis
import uuid
from dependencies.session_auth import check_authentication_header

CACHE_SERVER_HOST = os.environ.get("REDIS_SERVER_HOST")
CACHE_SERVER_PORT = os.environ.get("REDIS_SERVER_PORT")
rd = redis.Redis(host=CACHE_SERVER_HOST, port=int(CACHE_SERVER_PORT), db=0)

router = APIRouter()

@router.post("/signup")
def signup(user: schema.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.create_user(db, user)
    if not db_user:
        raise HTTPException(status_code=400, detail="User already exists or invalid data")
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: schema.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.user_id, user.user_pw)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Generate session_token
    session_token = str(uuid.uuid4())
    rd.set(session_token, db_user.id)
    return {"message": "login successfully","session_token": session_token}

@router.get("/profile/{user_id}")
def get_profile(user_id: str, db: Session = Depends(get_db), user_id_=Depends(check_authentication_header)):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": db_user.user_id,
        "name": db_user.name,
        "student_id": db_user.student_id,
        "department": db_user.department,
        "grade": db_user.grade
    }

@router.put("/profile/{user_id}")
def update_profile(user_id: str, profile: schema.UserProfile, db: Session = Depends(get_db), user_id_=Depends(check_authentication_header)):
    db_user = crud.update_user_profile(db, user_id, profile)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Profile updated successfully"}
