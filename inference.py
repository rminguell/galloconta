import cv2
import os
from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator
import kagglehub
import config

def download_model():
    model_path = kagglehub.model_download(config.MODEL_NAME, force_download=True)
    print(f"{config.DOWNLOAD_MSG} {model_path}")
    return model_path

def load_model():
    model_path = download_model()
    return YOLO(f"{model_path}/{config.MODEL_FILE_NAME}.pt")

def predict(image_path, conf=config.DEFAULT_CONF, iou=config.DEFAULT_IOU):
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
        annotator = Annotator(resized, line_width=5)
        annotator.text_label((0, 0, 400, 100), label=f'{object_count} grullas', margin=10)
        annotated_image = result.plot(show=False, labels=False, line_width=1)
        output_image_path = image_path.replace('input', 'output')
        cv2.imwrite(output_image_path, annotated_image)

    return output_image_path, object_count
