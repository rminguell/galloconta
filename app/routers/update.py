from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from ..inference import load_model
from ..dependencies import authenticate

router = APIRouter()

@router.get("/update")
def update_model(user: str = Depends(authenticate)):
    load_model(update=True)
    return JSONResponse(content={"message": "Model updated successfully"})
