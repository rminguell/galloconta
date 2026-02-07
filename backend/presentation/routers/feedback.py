from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from backend.core.config import settings
from backend.presentation.dependencies import get_submit_feedback_use_case
from backend.application.use_cases.submit_feedback import SubmitFeedbackUseCase

router = APIRouter()


@router.post("/feedback")
async def feedback(
    request: Request,
    use_case: SubmitFeedbackUseCase = Depends(get_submit_feedback_use_case),
):
    data = await request.json()
    if not data or "like" not in data or "fileName" not in data:
        return JSONResponse(content={"message": "Invalid data"}, status_code=400)

    like = data["like"]
    file_name = data["fileName"]
    param_1 = data.get("param_1", 100 * (1 - settings.DEFAULT_CONF))
    param_2 = data.get("param_2", 100 * (1 - settings.DEFAULT_IOU))
    conf = 1 - param_1 / 100
    iou = 1 - param_2 / 100

    success, message = use_case.execute(like, file_name, conf, iou)

    if success:
        return {"message": message}
    else:
        return JSONResponse(content={"message": message}, status_code=500)
