from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import schema, crud, database
from typing import List, Optional
from db.database import get_db
from dependencies.session_auth import check_authentication_header
from utils.llm_response import answer, chat_summary

router = APIRouter(
    prefix="/api/chats",
    tags=["chats"]
)

@router.post("/")
def create_chat(db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    chat = crud.create_chat(db, user_id)
    return {"message": "Chat created successfully","chat_id": chat.chat_id}

@router.get("/{chat_id}")
def get_chat(chat_id: int, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    chat = crud.get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    messages = crud.get_messages_by_chat(db, chat_id)
    chat_data = schema.ChatRead(
        chat_id=chat.chat_id,
        user_id=chat.user_id,
        chat_summary=chat.chat_summary,
        is_shared=chat.is_shared,
        messages=[schema.MessageRead(
            message_id=m.message_id,
            source=m.source,
            content=m.content,
            ref_doc_id=m.ref_doc_id
        ) for m in messages]
    )
    return chat_data

@router.get("/")
def list_chats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    # Only return chats belonging to the authenticated user
    chats = crud.get_chats(db, user_id=user_id, skip=skip, limit=limit)
    result = []
    for chat in chats:
        messages = crud.get_messages_by_chat(db, chat.chat_id)
        chat_data = schema.ChatRead(
            chat_id=chat.chat_id,
            user_id=chat.user_id,
            chat_summary=chat.chat_summary,
            is_shared=chat.is_shared,
            messages=[schema.MessageRead(
                message_id=m.message_id,
                source=m.source,
                content=m.content,
                ref_doc_id=m.ref_doc_id
            ) for m in messages]
        )
        result.append(chat_data)
    return result

from utils.llm_response import answer

@router.post("/{chat_id}/message")
def create_message(chat_id: int, message: schema.MessageCreate, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    chat = crud.get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # Store user message, always as "Human"
    db_message = crud.create_message(db, message, chat_id, src_type="Human")
    # Call LLM to get response
    llm_response = answer(message.content)
    summary = chat_summary(message.content+message.content)
    # Update chat summary
    crud.update_chat_summary(db, chat_id, summary)
    # Store LLM response as a new message, always as "AI"
    ai_message = schema.MessageCreate(
        content=llm_response,
        ref_doc_id=None
    )
    crud.create_message(db, ai_message, chat_id, src_type="AI")
    return {"llm_response": llm_response}

@router.get("/{chat_id}/messages")
def get_messages(chat_id: int, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    chat = crud.get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    messages = crud.get_messages_by_chat(db, chat_id)
    return [schema.MessageRead(
        message_id=m.message_id,
        source=m.source,
        content=m.content,
        ref_doc_id=m.ref_doc_id
    ) for m in messages]

@router.get("/shared/")
def get_shared_chats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    chats = crud.get_shared_chats(db, user_id=user_id, skip=skip, limit=limit)
    result = []
    for chat in chats:
        messages = crud.get_messages_by_chat(db, chat.chat_id)
        chat_data = schema.ChatRead(
            chat_id=chat.chat_id,
            user_id=chat.user_id,
            chat_summary=chat.chat_summary,
            is_shared=chat.is_shared,
            messages=[schema.MessageRead(
                message_id=m.message_id,
                source=m.source,
                content=m.content,
                ref_doc_id=m.ref_doc_id
            ) for m in messages]
        )
        result.append(chat_data)
    return result
