from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.inference import get_model
from app.dependencies import authenticate

router = APIRouter()

@router.get("/update")
def update_model(user: str = Depends(authenticate)):
    get_model(update=True)
    return JSONResponse(content={"message": "Model updated successfully"})
