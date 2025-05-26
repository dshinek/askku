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

def get_user_by_id(db: Session, user_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_student_id(db: Session, student_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.student_id == student_id).first()

def authenticate_user(db: Session, user_id: str, user_pw: str) -> Optional[models.User]:
    user = get_user_by_id(db, user_id)
    if user and user.user_pw == user_pw:  # In production, use hashed password check!
        return user

# Document CRUD
def create_doc(db: Session, doc: schema.DocCreate) -> models.Doc:
    db_doc = models.Doc(
        doc_name=doc.doc_name,
        doc_content=doc.doc_content,
        doc_thumbnail=doc.doc_thumbnail,
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

def get_doc(db: Session, doc_id: int) -> Optional[models.Doc]:
    return db.query(models.Doc).filter(models.Doc.doc_id == doc_id).first()

def get_docs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Doc).offset(skip).limit(limit).all()

def search_docs(db: Session, keyword: str):
    return db.query(models.Doc).filter(models.Doc.doc_name.ilike(f"%{keyword}%")).all()

def update_user_profile(db: Session, user_id: str, profile: schema.UserProfile) -> Optional[models.User]:
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
def create_chat(db: Session, chat: schema.ChatCreate) -> models.Chat:
    db_chat = models.Chat(
        chat_summary=chat.chat_summary,
        user_id=chat.user_id,
        is_shared=chat.is_shared if chat.is_shared is not None else False,
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

def get_shared_chats(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Chat).filter(models.Chat.is_shared == True).offset(skip).limit(limit).all()

# Message CRUD
def create_message(db: Session, message: schema.MessageCreate, chat_id: int) -> models.Message:
    db_message = models.Message(
        source=message.source,
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
