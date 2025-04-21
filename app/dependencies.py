import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from ftpretty import ftpretty
import config

security = HTTPBasic()

def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    user = credentials.username
    password = credentials.password
    if user != os.getenv("BASIC_AUTH_USER") or password != os.getenv("BASIC_AUTH_PASS"):
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

def clear_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(config.FTP_UPLOAD_ERROR.format(file_path, e))

def upload_file_to_ftp(file_path, file_name):
    try:
        ftp_host = os.getenv("FTP_HOST")
        ftp_user = os.getenv("FTP_USER")
        ftp_pass = os.getenv("FTP_PASS")
        ftp = ftpretty(ftp_host, ftp_user, ftp_pass)
        ftp.put(file_path, file_name)
        ftp.close()
        return f"{config.FTP_UPLOAD_SUCCESS} {file_name}"
    except Exception as e:
        print(f"{config.FTP_UPLOAD_ERROR} {file_name} - {e}")
        return None
