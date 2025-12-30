import cv2
from ultralytics import YOLO
from backend.core.config import settings
from backend.domain.entities.prediction import PredictionResult
from backend.domain.ports.storage import ModelRepository


class YOLOPredictor:
    def __init__(self, model_repository: ModelRepository):
        self._model_repository = model_repository
        self._image_size = settings.IMAGE_SIZE
        self._max_detection = settings.MAX_DETECTION

    def predict(self, image_path: str, conf: float, iou: float) -> PredictionResult:
        image = cv2.imread(image_path)
        resized = self._resize_image(image)

        model_path = self._model_repository.get_model_path()
        model = YOLO(model_path)
        results = model.predict(
            resized,
            imgsz=self._image_size,
            max_det=self._max_detection,
            conf=conf,
            iou=iou,
        )

        for result in results:
            object_count = len(result.boxes.cls)
            annotated_image = result.plot(show=False, labels=False, line_width=1)
            output_image_path = image_path.replace("input", "output")
            cv2.imwrite(output_image_path, annotated_image)

            return PredictionResult(
                input_image_path=image_path,
                output_image_path=output_image_path,
                object_count=object_count,
            )

    def _resize_image(self, image):
        height, width = image.shape[:2]
        scale = self._image_size / max(height, width)
        new_width = int(width * scale)
        new_height = int(height * scale)
        return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
