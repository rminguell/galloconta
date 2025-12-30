import { PredictionResult } from "@/domain/entities/prediction";

export interface PredictionService {
  predict(
    file: File,
    sensitivity: number,
    duplicates: number
  ): Promise<PredictionResult>;
}

export interface FeedbackService {
  sendFeedback(
    like: boolean,
    filename: string,
    sensitivity: number,
    duplicates: number
  ): Promise<void>;
}
