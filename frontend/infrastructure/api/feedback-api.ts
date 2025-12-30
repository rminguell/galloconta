import { apiClient } from "./api-client";

export async function sendFeedback(
  like: boolean,
  filename: string,
  sensitivity: number,
  duplicates: number
): Promise<void> {
  await apiClient.post("/feedback", {
    like,
    fileName: filename,
    param_1: Math.round(sensitivity * 100),
    param_2: Math.round(duplicates * 100),
  });
}
