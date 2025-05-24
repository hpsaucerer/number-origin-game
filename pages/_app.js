// pages/_app.js

import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';
import { ModalProvider, useModal } from '@/context/ModalContext';
import AchievementsModal from '@/components/AchievementsModal'; // ✅ Import the modal
import { useEffect } from 'react';


// 👇 Helper wrapper to access modal inside provider
function ModalManager() {
  const { showAchievements, setShowAchievements } = useModal();
  return (
    <AchievementsModal
      open={showAchievements}
      onClose={() => setShowAchievements(false)}
    />
  );
}



export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
        console.log("Generated new deviceId:", deviceId);
      } else {
        console.log("Existing deviceId:", deviceId);
      }
    }
  }, []);

  return (
    <ModalProvider>
      <Head>
        <title>Numerus</title>
        <meta
          name="description"
          content="Numerus – The Daily Reverse Trivia Game. Strengthen your trivia muscle, one number at a time. Start your workout today!"
        />
        <meta name="google-site-verification" content="NFzRNjrQmkhs56W8QgrDymrXZy2rusezlOhR2fcBDRA" />
        <meta property="og:title" content="Numerus – The Daily Reverse Trivia Game" />
        <meta property="og:description" content="Can you guess what today's number represents? Use clues to solve the puzzle!" />
        <meta property="og:image" content="/social-preview.png" />
        <meta property="og:url" content="https://numerus.site" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main>
        <Component {...pageProps} />
        <Analytics />
        <ModalManager />
      </main>
    </ModalProvider>
  );
}
