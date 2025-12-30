class Settings:
    MODEL_NAME = "rminguell/grulla/pyTorch/default"
    MODEL_FILE_NAME = "GRULLA"
    DEFAULT_CONF = 0.17
    DEFAULT_IOU = 0.3
    IMAGE_SIZE = 2048
    MAX_DETECTION = 5000

    INPUT_FOLDER = "./input"
    OUTPUT_FOLDER = "./output"
    MODEL_FOLDER = "./model"

    CORS_ORIGINS = [
        "https://galloconta.vercel.app",
        "https://galloconta.app",
        "https://www.galloconta.app",
    ]


settings = Settings()
