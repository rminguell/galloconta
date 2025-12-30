import Image from "next/image";
import Link from "next/link";
import Uploader from "@/presentation/components/features/uploader";
import LanguageSwitcher from "@/presentation/components/features/language-switcher";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

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
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
        <Uploader />
      </div>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6 px-4">
        {t("contact")}{" "}
        <Link
          href="mailto:rodrigo.minguell@yahoo.com"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          {t("e_mail")}
        </Link>{" "}
        {t("or")}{" "}
        <Link
          href="https://www.linkedin.com/in/rodrigo-minguell"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          LinkedIn
        </Link>{" "}
      </p>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
        {t("copy")}
      </p>
    </main>
  );
}
