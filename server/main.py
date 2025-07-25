from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, chat, document

app = FastAPI()

import time
from fastapi import Request

@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    end_time = time.perf_counter()
    elapsed = end_time - start_time
    log_line = f"[PROFILE] {request.method} {request.url.path} took {elapsed:.4f} seconds\n"
    with open("profile_log.txt", "a") as f:
        f.write(log_line)
    return response

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
