from sqlalchemy.orm import Session
from db import models, schema
from sqlalchemy.exc import IntegrityError
from typing import Optional

# User CRUD
def create_user(db: Session, user: schema.UserCreate) -> Optional[models.User]:
    db_user = models.User(
        user_id=user.user_id,
        user_pw=user.user_pw,  # In production, hash the password!
        name=user.name,
        student_id=user.student_id,
        department=user.department,
        grade=user.grade,
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        return None

def get_user_by_email(db: Session, user_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_student_id(db: Session, student_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.student_id == student_id).first()

def authenticate_user(db: Session, user_id: str, user_pw: str) -> Optional[models.User]:
    user = get_user_by_email(db, user_id)
    if user and user.user_pw == user_pw:  # In production, use hashed password check!
        return user

def get_doc(db: Session, doc_id: int) -> Optional[models.Doc]:
    return db.query(models.Doc).filter(models.Doc.doc_id == doc_id).first()

def get_docs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Doc).order_by(models.Doc.doc_id).offset(skip).limit(limit).all()

def search_docs(db: Session, keyword: str):
    return db.query(models.Doc).filter(models.Doc.doc_name.ilike(f"%{keyword}%")).all()

def update_user_profile(db: Session, user_id: str, profile: schema.UserBase) -> Optional[models.User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    user.name = profile.name
    user.student_id = profile.student_id
    user.department = profile.department
    user.grade = profile.grade
    db.commit()
    db.refresh(user)
    return user

# Chat CRUD
def create_chat(db: Session, user_id) -> models.Chat:
    db_chat = models.Chat(
        chat_summary="",
        user_id=user_id,
        is_shared=True,
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_chat(db: Session, chat_id: int) -> Optional[models.Chat]:
    return db.query(models.Chat).filter(models.Chat.chat_id == chat_id).first()

def get_chats(db: Session, user_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Chat)
    if user_id is not None:
        query = query.filter(models.Chat.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def get_shared_chats(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    # Return shared chats except for the current user's own chats
    return db.query(models.Chat).filter(
        models.Chat.is_shared == True,
        models.Chat.user_id != user_id
    ).offset(skip).limit(limit).all()

# Message CRUD
def create_message(db: Session, message: schema.MessageCreate, chat_id: int, src_type) -> models.Message:
    db_message = models.Message(
        source=src_type,
        chat_id=chat_id,
        content=message.content,
        ref_doc_id=message.ref_doc_id,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_messages_by_chat(db: Session, chat_id: int):
    return db.query(models.Message).filter(models.Message.chat_id == chat_id).all()

def update_chat_summary(db: Session, chat_id: int, summary: str) -> Optional[models.Chat]:
    chat = get_chat(db, chat_id)
    if not chat:
        return None
    chat.chat_summary = summary
    db.commit()
    db.refresh(chat)
    return chat

def update_chat_share_status(db: Session, chat_id: int, is_shared: bool) -> Optional[models.Chat]:
    chat = get_chat(db, chat_id)
    if not chat:
        return None
    chat.is_shared = is_shared
    db.commit()
    db.refresh(chat)
    return chat

def doc_content_by_name(db: Session, doc_name: str) -> Optional[models.Doc]:
    return db.query(models.Doc).filter(models.Doc.doc_name == doc_name).first()