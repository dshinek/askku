#!/bin/bash

# Base URL
BASE_URL="http://localhost:8000"

# Placeholder session token (replace with a real one after login)
SESSION_TOKEN="598f437c-4449-4521-9443-30327a03f829"

echo "==== USERS API ===="

# Signup
curl -X POST "$BASE_URL/api/users/signup" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "testuser", "user_pw": "testpass", "name": "Test User", "student_id": "20230001", "department": "CS", "grade": 1}'

echo -e "\n"

# Login
curl -X POST "$BASE_URL/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "testuser", "user_pw": "testpass"}'

echo -e "\n"

# Get my profile
curl -X GET "$BASE_URL/api/users/profile/me" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# Update my profile
curl -X PUT "$BASE_URL/api/users/profile/me" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated User", "student_id": "20230001", "department": "CS", "grade": 2}'

echo -e "\n==== CHATS API ===="

# Create chat
curl -X POST "$BASE_URL/api/chats/" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# List my chats
curl -X GET "$BASE_URL/api/chats/?skip=0&limit=10" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# Get chat detail (replace CHAT_ID with a real chat id)
CHAT_ID="1"
curl -X GET "$BASE_URL/api/chats/$CHAT_ID" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# Send message to chat
curl -X POST "$BASE_URL/api/chats/$CHAT_ID/message" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, AI!", "ref_doc_id": null}'

echo -e "\n"

# Get messages in chat
curl -X GET "$BASE_URL/api/chats/$CHAT_ID/messages" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# Get shared chats
curl -X GET "$BASE_URL/api/chats/shared/?skip=0&limit=10" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n==== DOCUMENTS API ===="

# List documents
curl -X GET "$BASE_URL/api/docs/?skip=0&limit=10" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# Get document by id (replace DOC_ID with a real doc id)
DOC_ID="1"
curl -X GET "$BASE_URL/api/docs/$DOC_ID" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n"

# Search documents
curl -X GET "$BASE_URL/api/docs/search/?keyword=example" \
  -H "Authorization: Bearer $SESSION_TOKEN"

echo -e "\n==== END OF TESTS ===="
