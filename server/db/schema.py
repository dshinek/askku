from pydantic import BaseModel, Field
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    user_id: str
    name: str
    student_id: str
    department: str
    grade: int

class UserCreate(UserBase):
    user_pw: str

class UserRead(UserBase):
    id: int

class UserLogin(BaseModel):
    user_id: str
    user_pw: str

# Document Schemas
class DocBase(BaseModel):
    doc_name: str
    doc_content: str
    doc_thumbnail: Optional[str] = None

class DocRead(DocBase):
    doc_id: int

# Message Schemas
class MessageBase(BaseModel):
    source: str  # 'AI' or 'Human'
    content: str
    ref_doc_id: Optional[int] = None

class MessageRead(MessageBase):
    message_id: int

# Chat Schemas
class ChatBase(BaseModel):
    chat_summary: Optional[str] = None
    is_shared: Optional[bool] = False

class ChatCreate(ChatBase):
    user_id: int

class ChatRead(ChatBase):
    chat_id: int
    user_id: int
    messages: List[MessageRead] = []
