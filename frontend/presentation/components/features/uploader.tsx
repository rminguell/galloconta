"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { config } from "@/core/config";
import { usePrediction } from "@/application/hooks/use-prediction";
import ZoomableImage from "@/presentation/components/ui/zoomable-image";
import FeedbackForm from "@/presentation/components/features/feedback-form";
import AdjustParams from "@/presentation/components/features/adjust-params";

export default function Uploader() {
  const t = useTranslations("upload");
  const { predict, isLoading, result, getImageUrl } = usePrediction();

  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showSliders, setShowSliders] = useState(false);
  const [param1, setParam1] = useState(0.83);
  const [param2, setParam2] = useState(0.7);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);

  function reset() {
    setResultCount(null);
    setShowSliders(false);
    setFeedbackOpen(false);
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }

  function handleFileChange(selectedFile: File) {
    if (selectedFile.type.split("/")[0] !== "image") {
      alert(t("format_error"));
      return;
    }

    if (
      selectedFile.size / 1024 / 1024 > config.maxUploadMB &&
      config.maxUploadMB > 0
    ) {
      alert(`${t("size_error")} ${config.maxUploadMB} MB`);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    try {
      const predictionResult = await predict(file, param1, param2);
      if (predictionResult) {
        setImageName(predictionResult.resultImage.split("/").pop() ?? "");
        setPreview(getImageUrl(predictionResult.resultImage));
        setResultCount(predictionResult.objectCount);
        setShowSliders(true);
      }
    } catch {
      alert(t("prediction_error"));
    }
  }

  async function handleDownload() {
    if (!preview) return;
    try {
      const response = await fetch(preview);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resultCount}_${imageName}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // Download failed silently
    }
  }

  return (
    <>
      {feedbackOpen && file && (
        <FeedbackForm
          closeForm={reset}
          filename={imageName}
          param_1={param1}
          param_2={param2}
        />
      )}

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div>
          <div className="space-y-1 mb-4">
            <h2 className="text-xl font-semibold text-center">{t("start")}</h2>
          </div>
          <label
            hidden={!isLoading && resultCount != null}
            htmlFor="image-upload"
            className="group relative mt-2 aspect-[3/2] cursor-pointer flex flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
          >
            {!file && (
              <div
                className="absolute z-[5] h-full w-full rounded-md"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  const droppedFile = e.dataTransfer?.files?.[0];
                  if (droppedFile) handleFileChange(droppedFile);
                }}
              />
            )}
            {!file && (
              <div
                className={`${
                  dragActive ? "border-2 border-black" : ""
                } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
                  preview
                    ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                    : "bg-white opacity-100 hover:bg-gray-50"
                }`}
              >
                <svg
                  className={`${
                    dragActive ? "scale-110" : "scale-100"
                  } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>Upload icon</title>
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                <p className="mt-2 text-center text-sm text-gray-500">
                  {t("drag")}
                </p>
                <p className="mt-2 text-center text-sm text-gray-500">
                  {t("limit")}: {config.maxUploadMB} MB
                </p>
                <span className="sr-only">Photo upload</span>
              </div>
            )}

            {preview && file && (
              <div className="relative w-full aspect-[3/2] rounded-md overflow-hidden">
                <ZoomableImage
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-black/20 border-t-black" />
                  </div>
                )}
                {resultCount !== null && !feedbackOpen && (
                  <div className="absolute bottom-2 left-2 flex space-x-2 z-50">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex items-center space-x-2 px-3 py-2 bg-white rounded-full shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 10l5 5 5-5M12 4v12"
                        />
                      </svg>
                      <span className="text-black text-sm">{t("download")}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              disabled={file != null}
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const selectedFile = event.currentTarget?.files?.[0];
                if (selectedFile) handleFileChange(selectedFile);
              }}
            />
          </div>
        </div>

        {resultCount === null && (
          <button
            id="predictButton"
            type="submit"
            disabled={isLoading || !file}
            className="text-sm font-medium border-black bg-black text-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
          >
            {t("predict")}
          </button>
        )}

        {resultCount !== null && (
          <div className="text-center text-3xl font-bold">
            {resultCount} {t("cranes")}
          </div>
        )}

        {showSliders && (
          <AdjustParams
            show={showSliders}
            param1={param1}
            setParam1={setParam1}
            param2={param2}
            setParam2={setParam2}
            onSubmit={() => {
              if (file)
                handleSubmit({
                  preventDefault: () => {},
                } as FormEvent<HTMLFormElement>);
            }}
          />
        )}

        <button
          id="reloadButton"
          type="reset"
          onClick={() => {
            resultCount !== null ? setFeedbackOpen(true) : reset();
          }}
          disabled={isLoading || !file}
          className="text-sm font-medium border-gray-200 bg-gray-100 text-gray-700 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
        >
          {t("reset")}
        </button>
      </form>
    </>
  );
}
