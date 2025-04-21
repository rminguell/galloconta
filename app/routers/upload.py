import os
import time
from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from app.inference import predict
from app.dependencies import clear_folder
import app.config as config

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile,
    param_1: float = Form(default=100*(1 - config.DEFAULT_CONF)),
    param_2: float = Form(default=100*(1 - config.DEFAULT_IOU))
):
    if not file.filename:
        return JSONResponse(content={"message": config.NO_FILE_SELECTED}, status_code=400)

    conf = 1 - param_1 / 100
    iou = 1 - param_2 / 100

    clear_folder(config.INPUT_FOLDER)
    clear_folder(config.OUTPUT_FOLDER)

    epoch_time = str(int(time.time()))
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{epoch_time}{file_extension}"
    file_path = os.path.join(config.INPUT_FOLDER, unique_filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    result_image_path, object_count = predict(file_path, conf, iou)

    return {
        "input_image": file_path,
        "result_image": result_image_path,
        "object_count": object_count,
    }

@router.get("/input/{filename}")
def uploaded_file(filename: str):
    return FileResponse(os.path.join(config.INPUT_FOLDER, filename))

@router.get("/output/{filename}")
def output_file(filename: str):
    return FileResponse(os.path.join(config.OUTPUT_FOLDER, filename))
