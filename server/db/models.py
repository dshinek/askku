from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), unique=True, nullable=False)
    user_pw = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    student_id = Column(String(20), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    grade = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint('grade >= 1 AND grade <= 6', name='check_grade_range'),
    )

    chats = relationship("Chat", back_populates="user")


class Doc(Base):
    __tablename__ = "docs"

    doc_id = Column(Integer, primary_key=True, index=True)
    doc_name = Column(String(255), nullable=False)
    doc_content = Column(Text, nullable=False)
    doc_thumbnail = Column(Text)

    messages = relationship("Message", back_populates="ref_doc")


class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(Integer, primary_key=True, index=True)
    chat_summary = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_shared = Column(Boolean, default=False)

    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True, index=True)
    source = Column(String(10), nullable=False)  # 'AI' or 'Human'
    chat_id = Column(Integer, ForeignKey("chats.chat_id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    ref_doc_id = Column(Integer, ForeignKey("docs.doc_id", ondelete="SET NULL"))

    chat = relationship("Chat", back_populates="messages")
    ref_doc = relationship("Doc", back_populates="messages")
