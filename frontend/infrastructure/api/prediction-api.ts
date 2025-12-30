import { PredictionResult } from "@/domain/entities/prediction";
import { apiClient } from "./api-client";

interface PredictResponse {
  input_image: string;
  object_count: number;
  result_image: string;
}

export async function uploadPredict(
  file: File,
  sensitivity: number,
  duplicates: number
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("param_1", Math.round(sensitivity * 100).toString());
  formData.append("param_2", Math.round(duplicates * 100).toString());

  const data = await apiClient.post<PredictResponse>("/upload", formData);

  return {
    inputImage: data.input_image,
    resultImage: data.result_image,
    objectCount: data.object_count,
  };
}

export function getResultImageUrl(resultImage: string): string {
  return apiClient.getFullUrl(resultImage);
}
