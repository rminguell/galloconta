**GalloConta** is a computer vision tool created to monitor the crane population at the Gallocanta Lake.

The lake is one of Spain’s most important bird sanctuaries. It serves as a critical stop for cranes during their migration. 

This app helps automate crane counting, aiding researchers and conservationists in tracking the species with greater efficiency and accuracy.

<br>

<div align="center">
  <a href="https://rminguell.github.io/galloconta/app">
    <img src="./img/button.png" alt="TRY DEMO">
  </a>
</div>

<br>

![Detection Result](./img/detection.jpg)

## Contents

- [Dataset](#dataset)
- [Model](#model)
- [Deploy](#deploy)
- [Acknowledgements](#acknowledgements)

## Dataset

The dataset consists of 165 images of crane flocks donated by local nature photographers. The images, each 2048x2048 pixels, are split into three subsets:  
- **113 training images**
- **33 validation images**
- **19 test images**

Annotations were made using **[CVAT](https://github.com/cvat-ai/cvat)**, a tool that simplifies the image labeling process.

![Anotation process](./img/anotation.png)

### How to use CVAT:
If you want to explore CVAT, you can follow the installation guide here:  
[Installing CVAT on Windows](https://github.com/kamipakistan/Installing-CVAT-on-Windows)

## Model

The app uses our **GRULLA** model, based on the YOLOv11 architecture, for detecting and counting cranes. YOLO is an advanced object detection model known for its accuracy and speed in real-time applications.

### Model Training:
Here is the code used for training the model:

```python
from ultralytics import YOLO
import os

data_dir = '/dataset'
output_dir = '/model'

model = YOLO('yolo11n.pt')

model.train(
    data=f"{data_dir}/dataset.yaml",
    epochs=600,            
    imgsz=2048,            
    batch=6,             
    save=True,            
    warmup_epochs=0,
    project=output_dir,
    name='grulla',
    exist_ok=True,
)

```

### Training Results:
The model’s training performance, including metrics, is detailed below:

```
Ultralytics 8.3.65 🚀 Python-3.11.11 torch-2.5.1+cu121 CUDA:0 (NVIDIA A100-SXM4-40GB, 40514MiB)

                 Class     Images  Instances          P          R      mAP50   mAP50-95

                   all         33       3524      0.846      0.723       0.81      0.529
```

![Training Results](./img/results.png)

### Test Metrics:
The model’s performance on the test subset is shown in the metrics below:

```
Ultralytics 8.3.65 🚀 Python-3.11.11 torch-2.5.1+cu121 CUDA:0 (NVIDIA A100-SXM4-40GB, 40514MiB)

                 Class     Images  Instances          P          R      mAP50   mAP50-95

                   all         19       2103      0.936      0.831       0.89      0.666
```

## Deploy

The app is deployed on **Google Cloud Run**, creating a real-time API endpoint that allows users to upload images and receive crane counting predictions quickly. This cloud-based solution ensures scalability and easy updates.

## Acknowledgements

Thanks to the photographers who donated images for the dataset:

- [Uge Fuertes](https://www.instagram.com/ugefuertessanz/)
- [Jaime D García](https://www.instagram.com/jaimemalagafotos)
- [Asociación Amigos de Gallocanta](https://www.instagram.com/amigosgallocanta/)

<br>

<div align="center">
  <a href="https://rminguell.github.io/galloconta/app">
    <img src="./img/button.png" alt="TRY DEMO">
  </a>
</div>

<br>