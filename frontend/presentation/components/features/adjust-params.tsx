"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type AdjustParamsProps = {
  show: boolean;
  param1: number;
  setParam1: Dispatch<SetStateAction<number>>;
  param2: number;
  setParam2: Dispatch<SetStateAction<number>>;
  onSubmit: () => void;
};

export default function AdjustParams({
  show,
  param1,
  setParam1,
  param2,
  setParam2,
  onSubmit,
}: AdjustParamsProps) {
  const t = useTranslations("params");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  const toggleAccordion = () => {
    if (!isOpen) {
      scrollPosition.current = window.scrollY;
      setIsOpen(true);
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 0);
    } else {
      setIsOpen(false);
      window.scrollTo({ top: scrollPosition.current, behavior: "smooth" });
    }
  };

  if (!show) return null;

  return (
    <div className="w-full mt-4 border rounded-md" ref={containerRef}>
      <button
        type="button"
        onClick={toggleAccordion}
        className="text-sm font-medium border-gray-200 bg-gray-100 text-gray-700 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 flex h-10 w-full items-center justify-center rounded-md border transition-all focus:outline-none"
      >
        {t("adjust")} {isOpen ? "▲" : "▼"}
      </button>

      {isOpen && (
        <div className="p-4 space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <label className="text-sm text-center md:text-left md:w-3/12">
              {t("sensitivity")}:
            </label>
            <span className="text-sm text-center text-gray-600 md:text-left md:w-1/12">
              {Math.round(param1 * 100)}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={param1}
              onChange={(e) => setParam1(Number(e.target.value))}
              className="w-full md:w-8/12 accent-indigo-500"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <label className="text-sm text-center md:text-left md:w-3/12">
              {t("duplicates")}:
            </label>
            <span className="text-sm text-center text-gray-600 md:text-left md:w-1/12">
              {Math.round(param2 * 100)}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={param2}
              onChange={(e) => setParam2(Number(e.target.value))}
              className="w-full md:w-8/12 accent-indigo-500"
            />
          </div>

          <button
            id="adjustButton"
            type="button"
            onClick={onSubmit}
            className="mt-2 w-full h-10 rounded-md border border-black bg-black text-white hover:bg-white hover:text-black transition-all text-sm"
          >
            {t("predict")}
          </button>
        </div>
      )}
    </div>
  );
}
