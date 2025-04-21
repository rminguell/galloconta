import cv2
import os
import shutil
from ultralytics import YOLO
import kagglehub
import config

def download_model():
    model_path = kagglehub.model_download(config.MODEL_NAME, force_download=True)
    print(f"{config.DOWNLOAD_MSG} {model_path}")
    return model_path

def load_model(update=False):
    local_model_path = f"{config.MODEL_FOLDER}/{config.MODEL_FILE_NAME}.pt"
    
    if update or not os.path.exists(local_model_path):
        downloaded_model_dir = download_model()
        downloaded_model_file = f"{downloaded_model_dir}/{config.MODEL_FILE_NAME}.pt"

        if os.path.exists(downloaded_model_file):
            os.makedirs(os.path.dirname(local_model_path), exist_ok=True)
            shutil.move(downloaded_model_file, local_model_path)
    
    return YOLO(local_model_path)

def predict(image_path, conf=config.DEFAULT_CONF, iou=config.DEFAULT_IOU, annotated = False):
    image = cv2.imread(image_path)
    height, width = image.shape[:2]
    scale = 2048 / max(height, width)
    new_width = int(width * scale)
    new_height = int(height * scale)
    resized = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)

    model = load_model()
    results = model.predict(resized, imgsz=2048, max_det=5000, conf=conf, iou=iou)

    for result in results:
        object_count = len(result.boxes.cls)
        annotated_image = result.plot(show=False, labels=False, line_width=1)
        
        if annotated:
            cv2.putText(annotated_image, object_count, (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 4, cv2.LINE_AA)

        output_image_path = image_path.replace('input', 'output')
        cv2.imwrite(output_image_path, annotated_image)

        return output_image_path, object_count
