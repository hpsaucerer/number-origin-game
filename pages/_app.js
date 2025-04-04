// pages/_app.js

import '@/styles/globals.css'; // Global styles
import { Be_Vietnam_Pro } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

// Load the Google font
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-bevietnam', // Optional: for custom CSS
});

// App wrapper with font and analytics
export default function App({ Component, pageProps }) {
  return (
    <main className={beVietnamPro.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}