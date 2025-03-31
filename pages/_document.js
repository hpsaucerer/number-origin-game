// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* custom fonts, meta tags etc */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
