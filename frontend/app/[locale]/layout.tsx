import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {routing} from '@/i18n/routing';
import AnalyticsConsent from '@/presentation/components/features/analytics-consent';
import './globals.css';
import { Inter } from 'next/font/google';

const SITE_URL = 'https://galloconta.app';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'title'});
  const title = t('title');
  const description = t('description');
  const ogLocale = locale === 'es' ? 'es_ES' : 'en_US';

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: '/es',
        en: '/en',
        'x-default': '/es'
      }
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'GalloConta',
      images: [{url: '/og-image.jpg', width: 1200, height: 799}],
      locale: ogLocale,
      alternateLocale: ogLocale === 'es_ES' ? 'en_US' : 'es_ES',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg']
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'title'});

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'GalloConta',
        url: SITE_URL,
        description: t('description'),
        inLanguage: locale,
        publisher: {'@id': `${SITE_URL}/#entibo`}
      },
      {
        '@type': 'SoftwareApplication',
        name: 'GalloConta',
        applicationCategory: 'Computer vision / wildlife monitoring',
        operatingSystem: 'Any (web-based)',
        url: SITE_URL,
        description: t('description'),
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'EUR'},
        publisher: {'@id': `${SITE_URL}/#entibo`}
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#entibo`,
        name: 'Entibo',
        url: 'https://entibo.es',
        sameAs: [
          'https://lab.galloconta.app',
          'https://github.com/rminguell/galloconta'
        ]
      }
    ]
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          {children}
          <AnalyticsConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
