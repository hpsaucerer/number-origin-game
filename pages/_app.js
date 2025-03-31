import '@/styles/globals.css'; // Import global styles first
import { Be_Vietnam_Pro } from 'next/font/google';

// Load the Google font
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-bevietnam', // optional, if you want to use it in CSS
});

// Correct default App wrapper with font applied
export default function App({ Component, pageProps }) {
  return (
    <main className={beVietnamPro.className}>
      <Component {...pageProps} />
    </main>
  );
}
