"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";

const CONSENT_KEY = "galloconta_cookie_consent";
const GTM_ID = "GTM-TSJXQQKN";
const GA_ID = "G-G4RSCNRHFT";

type Consent = "granted" | "denied";

export default function AnalyticsConsent() {
  const t = useTranslations("cookies");
  const [consent, setConsent] = useState<Consent | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
    }
    setHydrated(true);
  }, []);

  const decide = (value: Consent) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {hydrated && consent === null && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-700">
          <p className="text-center sm:text-left max-w-xl">{t("message")}</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => decide("denied")}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {t("reject")}
            </button>
            <button
              onClick={() => decide("granted")}
              className="px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
