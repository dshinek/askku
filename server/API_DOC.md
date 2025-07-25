# API Documentation

This document describes the REST API endpoints for the backend service.

**Base URL:** `http://localhost:8000`

---

## Authentication

Most endpoints require authentication via a session token.  
Include the following header in your requests after logging in:

```
Authorization: Bearer YOUR_SESSION_TOKEN
```

---

## Users API

### Signup

- **POST** `/api/users/signup`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "user_id": "string",
    "user_pw": "string",
    "name": "string",
    "student_id": "string",
    "department": "string",
    "grade": int
  }
  ```
- **Response:**  
  `{"message": "User created successfully"}`
- **Authentication:** Not required

**Example:**
```bash
curl -X POST http://localhost:8000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"user_id": "testuser", "user_pw": "testpass", "name": "Test User", "student_id": "20230001", "department": "CS", "grade": 1}'
```

---

### Login

- **POST** `/api/users/login`
- **Description:** Log in and receive a session token.
- **Request Body:**
  ```json
  {
    "user_id": "string",
    "user_pw": "string"
  }
  ```
- **Response:**  
  `{"message": "login successfully", "session_token": "..."}`  
- **Authentication:** Not required

**Example:**
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"user_id": "testuser", "user_pw": "testpass"}'
```

---

### Get My Profile

- **GET** `/api/users/profile/me`
- **Description:** Get the authenticated user's profile.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Response:**
  ```json
  {
    "user_id": "string",
    "name": "string",
    "student_id": "string",
    "department": "string",
    "grade": int
  }
  ```
- **Authentication:** Required

**Example:**
```bash
curl -X GET http://localhost:8000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### Update My Profile

- **PUT** `/api/users/profile/me`
- **Description:** Update the authenticated user's profile.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Request Body:**
  ```json
  {
    "name": "string",
    "student_id": "string",
    "department": "string",
    "grade": int
  }
  ```
- **Response:**  
  `{"message": "Profile updated successfully"}`
- **Authentication:** Required

**Example:**
```bash
curl -X PUT http://localhost:8000/api/users/profile/me \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated User", "student_id": "20230001", "department": "CS", "grade": 2}'
```

---

## Chats API

### Create Chat

- **POST** `/api/chats/`
- **Description:** Create a new chat.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Response:**  
  `{"message": "Chat created successfully", "chat_id": int}`
- **Authentication:** Required

**Example:**
```bash
curl -X POST http://localhost:8000/api/chats/ \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### List My Chats

- **GET** `/api/chats/`
- **Description:** List all chats for the authenticated user.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Query Parameters:**
  - `skip` (int, optional, default=0)
  - `limit` (int, optional, default=100)
- **Response:**  
  `[...]` (list of chat objects)
- **Authentication:** Required

**Example:**
```bash
curl -X GET "http://localhost:8000/api/chats/?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### Get Chat Detail

- **GET** `/api/chats/{chat_id}`
- **Description:** Get details of a specific chat.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Path Parameters:**
  - `chat_id` (int, required)
- **Response:**  
  Chat object with messages
- **Authentication:** Required

**Example:**
```bash
curl -X GET http://localhost:8000/api/chats/1 \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### Send Message to Chat

- **POST** `/api/chats/{chat_id}/message`
- **Description:** Send a message to a chat and receive an AI response.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Path Parameters:**
  - `chat_id` (int, required)
- **Request Body:**
  ```json
  {
    "content": "string",
    "ref_doc_id": int | null
  }
  ```
- **Response:**  
  `{"llm_response": "string"}`
- **Authentication:** Required

**Example:**
```bash
curl -X POST http://localhost:8000/api/chats/1/message \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, AI!", "ref_doc_id": null}'
```

---

### Get Messages in Chat

- **GET** `/api/chats/{chat_id}/messages`
- **Description:** Get all messages in a chat.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Path Parameters:**
  - `chat_id` (int, required)
- **Response:**  
  List of message objects
- **Authentication:** Required

**Example:**
```bash
curl -X GET http://localhost:8000/api/chats/1/messages \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### Get Shared Chats

- **GET** `/api/chats/shared/`
- **Description:** Get shared chats for the authenticated user.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Query Parameters:**
  - `skip` (int, optional, default=0)
  - `limit` (int, optional, default=100)
- **Response:**  
  List of shared chat objects
- **Authentication:** Required

**Example:**
```bash
curl -X GET "http://localhost:8000/api/chats/shared/?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

## Documents API

### List Documents

- **GET** `/api/docs/`
- **Description:** List all documents.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Query Parameters:**
  - `skip` (int, optional, default=0)
  - `limit` (int, optional, default=100)
- **Response:**  
  List of document objects
- **Authentication:** Required

**Example:**
```bash
curl -X GET "http://localhost:8000/api/docs/?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### Get Document by ID

- **GET** `/api/docs/{doc_id}`
- **Description:** Get a document by its ID.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Path Parameters:**
  - `doc_id` (int, required)
- **Response:**  
  Document object
- **Authentication:** Required

**Example:**
```bash
curl -X GET http://localhost:8000/api/docs/1 \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

### Search Documents

- **GET** `/api/docs/search/`
- **Description:** Search documents by keyword.
- **Headers:**  
  `Authorization: Bearer YOUR_SESSION_TOKEN`
- **Query Parameters:**
  - `keyword` (string, required)
- **Response:**  
  List of matching document objects
- **Authentication:** Required

**Example:**
```bash
curl -X GET "http://localhost:8000/api/docs/search/?keyword=example" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

---

## Error Handling

All error responses follow this format:
```json
{
  "detail": "Error message"
}
```

---

## Notes

- Replace `YOUR_SESSION_TOKEN` with the token received from the login endpoint.
- Replace path parameters (e.g., `{chat_id}`, `{doc_id}`) with actual values.
- All endpoints return JSON responses.
