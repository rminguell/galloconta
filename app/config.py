# Model Configuration
MODEL_NAME = 'rminguell/grulla/pyTorch/default'
MODEL_FILE_NAME = 'GRULLA'
DEFAULT_CONF = 0.17
DEFAULT_IOU = 0.3
IMAGE_SIZE = 2048
MAX_DETECTION = 5000

# File Directories
INPUT_FOLDER = './input'
OUTPUT_FOLDER = './output'
MODEL_FOLDER = './model'

# CORS Configuration
CORS_ORIGINS = ["https://galloconta.vercel.app","https://galloconta.app","https://www.galloconta.app"]

# Error and Status Messages
UPLOAD_ERROR = "No file found in the request."
NO_FILE_SELECTED = "No file selected."
FTP_UPLOAD_ERROR = "Error uploading file to FTP server:"
FTP_UPLOAD_SUCCESS = "File successfully uploaded to FTP server:"
INVALID_DATA = "Invalid data."
FEEDBACK_SUCCESS = "Feedback received."
FEEDBACK_SUCCESS_FTP = "Feedback received and file uploaded to FTP server."
FEEDBACK_ERROR_FTP = "Feedback received, but file could not be uploaded to FTP server."

# Download Message
DOWNLOAD_MSG = 'Model downloaded to:'
