from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, chat, document

app = FastAPI()

# CORS settings (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers if available
if auth:
    app.include_router(auth.router)
if chat:
    app.include_router(chat.router)
if document:
    app.include_router(document.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Askku API"}
