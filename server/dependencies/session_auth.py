from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader
import os
import redis

CACHE_SERVER_HOST = os.environ.get("REDIS_SERVER_HOST")
CACHE_SERVER_PORT = os.environ.get("REDIS_SERVER_PORT")

rd = redis.Redis(host=CACHE_SERVER_HOST, port=int(CACHE_SERVER_PORT), db=0)

session_key = APIKeyHeader(name='Bearer', auto_error=False)

def check_authentication_header(session_key: str = Depends(session_key)):
    try:
        user_id = rd.get(session_key).decode('utf-8')
        if user_id:
            return user_id
    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid Session",
        )
