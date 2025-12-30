from pydantic import BaseModel


class PredictionResponse(BaseModel):
    input_image: str
    result_image: str
    object_count: int


class FeedbackResponse(BaseModel):
    message: str
