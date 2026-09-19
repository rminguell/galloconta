import {routing} from '@/i18n/routing';

export default function RootPage() {
  const defaultLocalePath = `/${routing.defaultLocale}/`;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(defaultLocalePath)});`
        }}
      />
      <p>
        <a href={defaultLocalePath}>Continue to GalloConta</a>
      </p>
    </>
  );
}
