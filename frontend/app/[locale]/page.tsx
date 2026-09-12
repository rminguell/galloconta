import Image from "next/image";
import Link from "next/link";
import Uploader from "@/presentation/components/features/uploader";
import LanguageSwitcher from "@/presentation/components/features/language-switcher";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LanguageSwitcher />
      <h1 className="pb-8 flex justify-center items-center bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        <Image
          src="/favicon.png"
          alt="GalloConta Logo"
          width={200}
          height={200}
          className="h-[1.3em] w-auto pr-[0.3em]"
        />
        {t("title")}
      </h1>
      <p className="font-light text-gray-700 w-full max-w-xl text-center mb-8 px-4">
        {t("tagline")}
      </p>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <Uploader />
      </div>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6 px-4">
        {t("citizen_science")}{" "}
        <Link
          href="https://lab.galloconta.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          lab.galloconta.app
        </Link>
      </p>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-2 px-4">
        {t("contact")}{" "}
        <Link
          href="mailto:galloconta@entibo.es"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          galloconta@entibo.es
        </Link>
      </p>
      <div className="flex items-center gap-2 mt-8">
        <span className="text-sm text-gray-400">{t("developed_by")}</span>
        <Link
          href="https://entibo.es"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/entibo-logo.png"
            alt="Entibo"
            width={120}
            height={27}
            className="h-5 w-auto"
          />
        </Link>
      </div>
      <p className="font-light text-gray-400 text-xs text-center mt-3 mb-4">
        {t("copy")}
      </p>
    </main>
  );
}
