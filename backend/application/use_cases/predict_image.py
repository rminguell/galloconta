import os
import time
from backend.core.config import settings
from backend.domain.entities.prediction import PredictionResult
from backend.domain.ports.predictor import Predictor
from backend.domain.ports.storage import FileStorage


class PredictImageUseCase:
    def __init__(self, predictor: Predictor, file_storage: FileStorage):
        self._predictor = predictor
        self._file_storage = file_storage

    async def execute(
        self, file_content: bytes, filename: str, conf: float, iou: float
    ) -> PredictionResult:
        self._file_storage.ensure_folder_exists(settings.INPUT_FOLDER)
        self._file_storage.ensure_folder_exists(settings.OUTPUT_FOLDER)

        self._file_storage.clear_folder(settings.INPUT_FOLDER)
        self._file_storage.clear_folder(settings.OUTPUT_FOLDER)

        epoch_time = str(int(time.time()))
        file_extension = os.path.splitext(filename)[1]
        unique_filename = f"{epoch_time}{file_extension}"
        file_path = os.path.join(settings.INPUT_FOLDER, unique_filename)

        self._file_storage.save_file(file_path, file_content)

        return self._predictor.predict(file_path, conf, iou)
