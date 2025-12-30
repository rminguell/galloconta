from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.infrastructure.security.basic_auth import authenticate
from app.presentation.dependencies import get_update_model_use_case
from app.application.use_cases.update_model import UpdateModelUseCase

router = APIRouter()


@router.get("/update")
def update_model(
    user: str = Depends(authenticate),
    use_case: UpdateModelUseCase = Depends(get_update_model_use_case),
):
    message = use_case.execute()
    return JSONResponse(content={"message": message})
