// pages/_app.js

import '@/styles/globals.css';
import { Be_Vietnam_Pro } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head'; // 🆕 Import for meta tags

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-bevietnam',
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Numerus</title>
        <meta
          name="description"
    content="Numerus – The Daily Reverse Trivia Game. Strengthen your trivia muscle, one number at a time. Start your workout today! "
  />
  <meta name="google-site-verification" content="NFzRNjrQmkhs56W8QgrDymrXZy2rusezlOhR2fcBDRA" />

        {/* Optional Open Graph tags for social previews */}
        <meta property="og:title" content="Numerus – The Daily Reverse Trivia Game" />
        <meta property="og:description" content="Can you guess what today's number signifies? Use clues to solve the puzzle!" />
        <meta property="og:image" content="/social-preview.png" />
        <meta property="og:url" content="https://numerus.site" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className={beVietnamPro.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </>
  );
}
