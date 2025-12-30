"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const changeLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="w-full flex justify-end p-3 gap-2">
      <Link
        href={changeLocale("en")}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
      >
        EN
      </Link>
      <Link
        href={changeLocale("es")}
        className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
      >
        ES
      </Link>
    </div>
  );
}
