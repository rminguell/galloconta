import cv2
from ultralytics import YOLO
import app.config as config
from app.dependencies import get_model

def predict(image_path, conf=config.DEFAULT_CONF, iou=config.DEFAULT_IOU, annotated = False):
    image = cv2.imread(image_path)
    height, width = image.shape[:2]
    scale = config.IMAGE_SIZE / max(height, width)
    new_width = int(width * scale)
    new_height = int(height * scale)
    resized = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)

    model = YOLO(get_model())
    results = model.predict(resized, imgsz=config.IMAGE_SIZE, max_det=config.MAX_DETECTION, conf=conf, iou=iou)

    for result in results:
        object_count = len(result.boxes.cls)
        annotated_image = result.plot(show=False, labels=False, line_width=1)
        
        if annotated:
            cv2.putText(annotated_image, object_count, (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 4, cv2.LINE_AA)

        output_image_path = image_path.replace('input', 'output')
        cv2.imwrite(output_image_path, annotated_image)

        return output_image_path, object_count
