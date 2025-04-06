// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>

 {/* Favicon */}
        <link rel="icon" href="/favicon.png" />
        {/* Optional: Apple and PNG versions for better device support */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
    
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
