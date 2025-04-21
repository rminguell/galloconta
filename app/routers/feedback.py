import os
from fastapi import APIRouter, Request
from dependencies import upload_file_to_ftp
from ..config import config

router = APIRouter()

@router.post("/feedback")
async def feedback(request: Request):
    data = await request.json()
    if not data or "like" not in data or "fileName" not in data:
        return config.INVALID_DATA, 400

    like = data["like"]
    file_name = data["fileName"]
    source_path = os.path.join(config.INPUT_FOLDER, file_name)

    if not like and os.path.exists(source_path):
        ftp_result = upload_file_to_ftp(source_path, file_name)
        if ftp_result:
            return {"message": config.FEEDBACK_SUCCESS_FTP}
        else:
            return {"message": config.FEEDBACK_ERROR_FTP}, 500

    return {"message": config.FEEDBACK_SUCCESS}
