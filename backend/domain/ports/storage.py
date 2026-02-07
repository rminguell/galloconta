from typing import Protocol


class FileStorage(Protocol):
    def clear_folder(self, folder_path: str) -> None: ...
    def save_file(self, file_path: str, content: bytes) -> None: ...
    def file_exists(self, file_path: str) -> bool: ...


class FeedbackStorage(Protocol):
    def upload(
        self, file_path: str, file_name: str, conf: float, iou: float, feedback: str
    ) -> bool: ...


class ModelRepository(Protocol):
    def get_model_path(self, update: bool = False) -> str: ...
