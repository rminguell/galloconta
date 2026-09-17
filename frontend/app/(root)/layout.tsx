import {routing} from '@/i18n/routing';

export default function RootRedirectLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=/${routing.defaultLocale}/`} />
        <meta name="robots" content="noindex" />
        <meta name="google-site-verification" content="LNdGC1eip7YfZzPeaaFm799VzlhZAPiCha7KU7uXYQY" />
        <link rel="canonical" href={`https://galloconta.app/${routing.defaultLocale}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
