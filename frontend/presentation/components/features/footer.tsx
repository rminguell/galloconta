import Image from "next/image";
import Link from "next/link";

function MailIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
      <path d="M3.5 5.5l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M8 5H5.5A1.5 1.5 0 004 6.5v8A1.5 1.5 0 005.5 16h8a1.5 1.5 0 001.5-1.5V12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 4h4v4M15.5 4.5L9 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer({ t }: { t: (key: string) => string }) {
  return (
    <footer className="w-full max-w-lg mx-auto mt-10 pb-32 sm:pb-10 px-4">
      <div className="border-t border-gray-900/10 pt-7 flex flex-col items-center gap-5">
        <p className="text-center text-gray-800">
          {t("citizen_science")}{" "}
          <Link
            href="https://lab.galloconta.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:text-black transition-colors"
          >
            lab.galloconta.app
            <ExternalLinkIcon />
          </Link>
        </p>

        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          {t("contact")}
          <Link
            href="mailto:galloconta@entibo.es"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <MailIcon />
            galloconta@entibo.es
          </Link>
        </p>

        <Link
          href="https://entibo.es"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t("developed_by")}
          <Image
            src="/entibo-logo.png"
            alt="Entibo"
            width={120}
            height={27}
            className="h-3.5 w-auto opacity-80"
          />
        </Link>

        <p className="text-xs text-gray-300">{t("copy")}</p>
      </div>
    </footer>
  );
}
