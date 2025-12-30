import os
import shutil
import kagglehub
from backend.core.config import settings


class KaggleModelLoader:
    def __init__(self):
        self._model_folder = settings.MODEL_FOLDER
        self._model_name = settings.MODEL_NAME
        self._model_file_name = settings.MODEL_FILE_NAME

    def get_model_path(self, update: bool = False) -> str:
        local_model_path = f"{self._model_folder}/{self._model_file_name}.pt"

        if update or not os.path.exists(local_model_path):
            downloaded_model_dir = self._download_model()
            downloaded_model_file = f"{downloaded_model_dir}/{self._model_file_name}.pt"

            if os.path.exists(downloaded_model_file):
                os.makedirs(os.path.dirname(local_model_path), exist_ok=True)
                shutil.move(downloaded_model_file, local_model_path)

        return local_model_path

    def _download_model(self) -> str:
        return kagglehub.model_download(self._model_name, force_download=True)
