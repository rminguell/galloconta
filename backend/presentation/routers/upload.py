import os
from fastapi import APIRouter, UploadFile, Form, Depends
from fastapi.responses import JSONResponse, FileResponse
from backend.core.config import settings
from backend.presentation.dependencies import get_predict_image_use_case
from backend.application.use_cases.predict_image import PredictImageUseCase

router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile,
    param_1: float = Form(default=100 * (1 - settings.DEFAULT_CONF)),
    param_2: float = Form(default=100 * (1 - settings.DEFAULT_IOU)),
    use_case: PredictImageUseCase = Depends(get_predict_image_use_case),
):
    if not file.filename:
        return JSONResponse(content={"message": "No file selected"}, status_code=400)

    conf = 1 - param_1 / 100
    iou = 1 - param_2 / 100

    file_content = await file.read()
    result = await use_case.execute(file_content, file.filename, conf, iou)

    return {
        "input_image": result.input_image_path,
        "result_image": result.output_image_path,
        "object_count": result.object_count,
    }


@router.get("/input/{filename}")
def uploaded_file(filename: str):
    return FileResponse(os.path.join(settings.INPUT_FOLDER, filename))


@router.get("/output/{filename}")
def output_file(filename: str):
    return FileResponse(os.path.join(settings.OUTPUT_FOLDER, filename))
