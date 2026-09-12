"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
  zh: "中文"
};

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const changeLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="w-full flex justify-end p-3 gap-2">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={changeLocale(locale)}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
        >
          {LABELS[locale] ?? locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
