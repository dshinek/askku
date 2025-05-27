from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import schema, crud, database
from typing import List, Optional
from db.database import get_db
from dependencies.session_auth import check_authentication_header

router = APIRouter(
    prefix="/api/docs",
    tags=["docs"]
)

@router.get("/{doc_id}")
def get_document(doc_id: int, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    doc = crud.get_doc(db, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/")
def list_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    return crud.get_docs(db, skip=skip, limit=limit)

@router.get("/search/")
def search_documents(keyword: str = Query(..., min_length=1), db: Session = Depends(get_db), user_id=Depends(check_authentication_header)):
    return crud.search_docs(db, keyword)
