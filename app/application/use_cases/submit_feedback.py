import os
from app.core.config import settings
from app.domain.ports.storage import FeedbackStorage, FileStorage


class SubmitFeedbackUseCase:
    def __init__(self, feedback_storage: FeedbackStorage, file_storage: FileStorage):
        self._feedback_storage = feedback_storage
        self._file_storage = file_storage

    def execute(self, like: bool, file_name: str) -> tuple[bool, str]:
        if like:
            return True, "Feedback received."

        source_path = os.path.join(settings.INPUT_FOLDER, file_name)

        if not self._file_storage.file_exists(source_path):
            return True, "Feedback received."

        upload_success = self._feedback_storage.upload(source_path, file_name)

        if upload_success:
            return True, "Feedback received and file uploaded."
        else:
            return False, "Feedback received, but file could not be uploaded."
