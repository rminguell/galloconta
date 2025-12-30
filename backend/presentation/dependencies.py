from backend.infrastructure.ml.model_loader import KaggleModelLoader
from backend.infrastructure.ml.yolo_predictor import YOLOPredictor
from backend.infrastructure.persistence.file_storage import LocalFileStorage
from backend.infrastructure.persistence.ftp_storage import FTPFeedbackStorage
from backend.application.use_cases.predict_image import PredictImageUseCase
from backend.application.use_cases.submit_feedback import SubmitFeedbackUseCase
from backend.application.use_cases.update_model import UpdateModelUseCase


def get_model_loader() -> KaggleModelLoader:
    return KaggleModelLoader()


def get_file_storage() -> LocalFileStorage:
    return LocalFileStorage()


def get_feedback_storage() -> FTPFeedbackStorage:
    return FTPFeedbackStorage()


def get_predictor() -> YOLOPredictor:
    return YOLOPredictor(get_model_loader())


def get_predict_image_use_case() -> PredictImageUseCase:
    return PredictImageUseCase(get_predictor(), get_file_storage())


def get_submit_feedback_use_case() -> SubmitFeedbackUseCase:
    return SubmitFeedbackUseCase(get_feedback_storage(), get_file_storage())


def get_update_model_use_case() -> UpdateModelUseCase:
    return UpdateModelUseCase(get_model_loader())
