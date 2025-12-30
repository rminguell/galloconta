from typing import Protocol
from backend.domain.entities.prediction import PredictionResult


class Predictor(Protocol):
    def predict(
        self, image_path: str, conf: float, iou: float
    ) -> PredictionResult: ...
