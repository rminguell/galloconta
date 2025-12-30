"use client";

import { useState } from "react";
import { PredictionResult } from "@/domain/entities/prediction";
import {
  uploadPredict,
  getResultImageUrl,
} from "@/infrastructure/api/prediction-api";

export function usePrediction() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const predict = async (
    file: File,
    sensitivity: number,
    duplicates: number
  ): Promise<PredictionResult | null> => {
    setIsLoading(true);
    try {
      const data = await uploadPredict(file, sensitivity, duplicates);
      setResult(data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  const getImageUrl = (resultImage: string): string => {
    return getResultImageUrl(resultImage);
  };

  return { predict, reset, isLoading, result, getImageUrl };
}
