"use client";

import { useState } from "react";
import { sendFeedback as sendFeedbackApi } from "@/infrastructure/api/feedback-api";

export function useFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendFeedback = async (
    like: boolean,
    filename: string,
    sensitivity: number,
    duplicates: number
  ): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await sendFeedbackApi(like, filename, sensitivity, duplicates);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { sendFeedback, isSubmitting };
}
