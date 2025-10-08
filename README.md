# Askku

## 🧾 Project Name
**Askku (About SKKU / askk U)**

## 🧠 System Summary

Askku is a Perplexity-style question answering system specialized for Sungkyunkwan University students. It allows students to ask questions related to university policies, announcements, and official documents. The system searches relevant official documents using vector similarity (OpenAI Embeddings + Qdrant) and responds using ChatGPT API, considering the student’s context (student ID, department, grade, etc.).

## 🏗️ System Architecture

- **Frontend**: React (User Interface)
- **Backend**: FastAPI (Handles auth, chat, and document APIs)
- **Service Database**: PostgreSQL (User data, chats, messages, documents)
- **Vector Database**: Qdrant (Document embeddings for retrieval)
- **ML Server**: FastAPI-based server for embedding and inference

## ✨ Supported Features

### 🔐 Auth
- Sign Up
- Login / Logout
- Set user profile (department, grade, etc.)

### 💬 Chatting
- General Q&A chat (automatically searches relevant documents and answers based on user context)
- Document-based chat (select specific document to chat with)
- Message source: ‘AI’ or ‘Human’

### 📄 Document Retrieval
- Browse uploaded documents
- Keyword-based document search

### 🔗 Chat Sharing
- Share own chat logs
- Browse and view shared chats by others

## 📁 Project Structure

```
askku/
├── client/   # React frontend for user interaction
└── server/   # FastAPI backend for API and data processing
```

This architecture ensures a clean separation of concerns and allows for independent development and deployment of the frontend and backend components.
