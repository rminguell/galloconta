import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()


def authenticate(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    user = credentials.username
    password = credentials.password
    if user != os.getenv("BASIC_AUTH_USER") or password != os.getenv("BASIC_AUTH_PASS"):
        raise HTTPException(status_code=401, detail="Authentication required")
    return user
