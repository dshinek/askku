# API Documentation

This document describes the API endpoints for the server, referencing the actual server code and data models.

---

## Authentication

Some endpoints require authentication via a session token. Pass the session token in the request header as required.

---

## Endpoints

### Auth (`/auth`)

#### POST `/auth/signup`
- **Description:** Register a new user.
- **Request Body:** [`UserCreate`](#usercreate)
- **Response:** `{ "message": "User created successfully" }`
- **Errors:** 400 if user exists or invalid data.

#### POST `/auth/login`
- **Description:** Log in a user and receive a session token.
- **Request Body:** [`UserLogin`](#userlogin)
- **Response:** `{ "message": "login successfully", "session_token": "<token>" }`
- **Errors:** 401 if credentials are invalid.

#### GET `/auth/profile/{user_id}`
- **Description:** Get user profile.
- **Auth Required:** Yes (session token)
- **Response:** 
  ```json
  {
    "user_id": "...",
    "name": "...",
    "student_id": "...",
    "department": "...",
    "grade": ...
  }
  ```
- **Errors:** 404 if user not found.

#### PUT `/auth/profile/{user_id}`
- **Description:** Update user profile.
- **Auth Required:** Yes (session token)
- **Request Body:** [`UserProfile`](#userprofile)
- **Response:** `{ "message": "Profile updated successfully" }`
- **Errors:** 404 if user not found.

---

### Chat (`/chat`)

#### POST `/chat/`
- **Description:** Create a new chat.
- **Request Body:** [`ChatCreate`](#chatcreate)
- **Response:** [`ChatRead`](#chatread)

#### GET `/chat/{chat_id}`
- **Description:** Get a chat and its messages.
- **Auth Required:** Yes (session token)
- **Response:** [`ChatRead`](#chatread)
- **Errors:** 404 if chat not found.

#### GET `/chat/`
- **Description:** List chats (optionally filter by user).
- **Query Params:** `user_id` (optional), `skip`, `limit`
- **Auth Required:** Yes (session token)
- **Response:** List of [`ChatRead`](#chatread)

#### POST `/chat/{chat_id}/message`
- **Description:** Add a message to a chat and get LLM response.
- **Auth Required:** Yes (session token)
- **Request Body:** [`MessageCreate`](#messagebase) (source must be "Human")
- **Response:** `{ "llm_response": "<AI response>" }`
- **Errors:** 404 if chat not found, 400 if source is not "Human".

#### GET `/chat/{chat_id}/messages`
- **Description:** Get all messages for a chat.
- **Auth Required:** Yes (session token)
- **Response:** List of [`MessageRead`](#messageread)
- **Errors:** 404 if chat not found.

#### GET `/chat/shared/`
- **Description:** Get shared chats.
- **Query Params:** `skip`, `limit`
- **Auth Required:** Yes (session token)
- **Response:** List of [`ChatRead`](#chatread)

---

### Document (`/document`)

#### GET `/document/{doc_id}`
- **Description:** Get a document by ID.
- **Auth Required:** Yes (session token)
- **Response:** [`DocRead`](#docread)
- **Errors:** 404 if not found.

#### GET `/document/`
- **Description:** List documents.
- **Query Params:** `skip`, `limit`
- **Auth Required:** Yes (session token)
- **Response:** List of [`DocRead`](#docread)

#### GET `/document/search/`
- **Description:** Search documents by keyword.
- **Query Params:** `keyword` (required)
- **Auth Required:** Yes (session token)
- **Response:** List of [`DocRead`](#docread)

---

## Data Models

### UserCreate
```python
class UserCreate(BaseModel):
    user_id: str
    name: str
    student_id: str
    department: str
    grade: int
    user_pw: str
```

### UserLogin
```python
class UserLogin(BaseModel):
    user_id: str
    user_pw: str
```

### UserProfile
```python
class UserProfile(BaseModel):
    user_id: str
    name: str
    student_id: str
    department: str
    grade: int
```

### UserRead
```python
class UserRead(BaseModel):
    id: int
    user_id: str
    name: str
    student_id: str
    department: str
    grade: int
```

### DocRead
```python
class DocRead(BaseModel):
    doc_id: int
    doc_name: str
    doc_content: str
    doc_thumbnail: Optional[str] = None
```

### MessageBase / MessageCreate
```python
class MessageBase(BaseModel):
    source: str  # 'AI' or 'Human'
    content: str
    ref_doc_id: Optional[int] = None
```

### MessageRead
```python
class MessageRead(MessageBase):
    message_id: int
```

### ChatCreate
```python
class ChatCreate(BaseModel):
    user_id: int
    chat_summary: Optional[str] = None
    is_shared: Optional[bool] = False
```

### ChatRead
```python
class ChatRead(BaseModel):
    chat_id: int
    user_id: int
    chat_summary: Optional[str] = None
    is_shared: Optional[bool] = False
    messages: List[MessageRead] = []
```

---

## Root

#### GET `/`
- **Description:** Welcome message.
- **Response:** `{ "message": "Welcome to Askku API" }`

---

**Note:** All endpoints and models are referenced directly from the server code for accuracy.
