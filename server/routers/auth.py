from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import schema, crud, database
from db.database import get_db
import os
import redis
import uuid
from dependencies.session_auth import check_authentication_header

rd = redis.Redis(host="127.0.0.1", port=int("6380"), db=0)

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.post("/signup")
def signup(user: schema.UserBase, db: Session = Depends(get_db)):
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

@router.get("/profile/me")
def get_my_profile(db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
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

@router.put("/profile/me")
def update_my_profile(profile: schema.UserProfileUpdate, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    db_user = crud.update_user_profile(db, user_id, profile)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Profile updated successfully"}
