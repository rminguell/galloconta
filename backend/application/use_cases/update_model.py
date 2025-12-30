from backend.domain.ports.storage import ModelRepository


class UpdateModelUseCase:
    def __init__(self, model_repository: ModelRepository):
        self._model_repository = model_repository

    def execute(self) -> str:
        self._model_repository.get_model_path(update=True)
        return "Model updated successfully"
