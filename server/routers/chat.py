from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import schema, crud, database
from typing import List, Optional
from db.database import get_db
from dependencies.session_auth import check_authentication_header
from utils.llm_response import answer, chat_summary, answer_with_reference

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
    
    # 1. Retrieve all previous messages for this chat, ordered by message_id
    messages = crud.get_messages_by_chat(db, chat_id)
    messages = sorted(messages, key=lambda m: m.message_id)
    
    # 2. Concatenate previous messages with role prefix
    conversation_log = ""
    for m in messages:
        role = "Human" if m.source == "Human" else "AI"
        conversation_log += f"{role}: {m.content}\n"
    # 3. Add the new user message
    conversation_log += f"Human: {message.content}\n"

    # 4. Store user message, always as "Human"
    crud.create_message(db, message, chat_id, src_type="Human")

    # 5. Handle special case for document explanation
    if "문서에 대해 설명해줘!" in message.content:
        doc_content = crud.doc_content_by_name(db, message.content.replace("문서에 대해 설명해줘!", "").strip())
        llm_response = answer_with_reference(doc_content.doc_content + "\n"\
                                             + message.content + "\n최대한 자세히 요약해주고, 문서와 관련하여 나올 수 있는 질문을 3개 \
                                                만들어서 제시해줘 답까지 제시하진 말고 질문만 제시해줘 너무 인위적으로 요약 부분, 질문 제시 부분을 나누진 마")
    else:
        # 6. Send the concatenated conversation log to the GPT API
        llm_response,relative_doc_list = answer(conversation_log)

    # 7. Update chat summary
    summary = chat_summary(conversation_log)
    crud.update_chat_summary(db, chat_id, summary)
    # 8. Store LLM response as a new message, always as "AI"
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
