import os


def _env(name: str, default: str) -> str:
    # os.getenv(name, default) only falls back when the var is entirely
    # unset — docker-compose commonly passes an empty string instead
    # (`VAR=${VAR:-}`), which would otherwise silently override the default.
    return os.getenv(name) or default


class Settings:
    # Kaggle Hub model slug. This is the paid/tiered access point: swap it for
    # a different slug (your own custom-trained model, a premium tier, etc.)
    # via the MODEL_NAME env var — the code itself is model-agnostic.
    MODEL_NAME = _env("MODEL_NAME", "rminguell/grulla/pyTorch/default")
    MODEL_FILE_NAME = _env("MODEL_FILE_NAME", "GRULLA")
    DEFAULT_CONF = float(_env("DEFAULT_CONF", "0.17"))
    DEFAULT_IOU = float(_env("DEFAULT_IOU", "0.3"))
    IMAGE_SIZE = int(_env("IMAGE_SIZE", "2048"))
    MAX_DETECTION = int(_env("MAX_DETECTION", "5000"))

    INPUT_FOLDER = _env("INPUT_FOLDER", "./input")
    OUTPUT_FOLDER = _env("OUTPUT_FOLDER", "./output")
    MODEL_FOLDER = _env("MODEL_FOLDER", "./model")

    # Comma-separated list of allowed frontend origins. Defaults cover the
    # Entibo-hosted deployment; a self-hosted instance should set its own via
    # the CORS_ORIGINS env var.
    CORS_ORIGINS = [
        origin.strip()
        for origin in _env(
            "CORS_ORIGINS",
            "https://galloconta.app,https://www.galloconta.app,"
            "https://dev.galloconta.app,http://localhost:3000,http://localhost:3001",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
