"use client";

import { useTranslations } from "next-intl";
import { useFeedback } from "@/application/hooks/use-feedback";

interface FeedbackFormProps {
  closeForm: () => void;
  filename: string;
  param_1: number;
  param_2: number;
}

export default function FeedbackForm({
  closeForm,
  filename,
  param_1,
  param_2,
}: FeedbackFormProps) {
  const { sendFeedback, isSubmitting } = useFeedback();
  const t = useTranslations("feedback");

  const handleFeedback = async (like: boolean) => {
    await sendFeedback(like, filename, param_1, param_2);
    closeForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center space-y-4">
        <div className="text-lg font-medium">{t("question")}</div>
        <div className="flex justify-center gap-4">
          <button
            id="likeButton"
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            <span>{t("yes")}</span>
          </button>
          <button
            id="dislikeButton"
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <span>{t("no")}</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">{t("info")}</div>
      </div>
    </div>
  );
}
