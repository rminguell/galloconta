from dataclasses import dataclass


@dataclass
class PredictionResult:
    input_image_path: str
    output_image_path: str
    object_count: int
