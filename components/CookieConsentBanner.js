"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CookiePreferencesModal from "./CookiePreferencesModal";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => {
    const preferences = localStorage.getItem("cookiePreferences");
    if (!preferences) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (prefs) => {
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
    setVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ analytics: true });
  };

  const handleRejectAll = () => {
    saveConsent({ analytics: false });
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-100 border-t border-gray-300 p-4 flex flex-col sm:flex-row justify-between items-center shadow space-y-2 sm:space-y-0 sm:space-x-4">
        <p className="text-sm text-gray-800">
          We use cookies to improve your experience and analyze usage. You can accept all, reject non-essential, or manage preferences.
        </p>
        <div className="flex gap-2">
          <Button onClick={handleAcceptAll} className="bg-blue-600 text-white hover:bg-blue-700 text-sm">Accept All</Button>
          <Button onClick={handleRejectAll} variant="outline" className="text-sm">Reject</Button>
          <Button onClick={() => setShowPrefs(true)} variant="ghost" className="text-sm underline">Preferences</Button>
        </div>
      </div>

      <CookiePreferencesModal open={showPrefs} onClose={() => setShowPrefs(false)} onSave={saveConsent} />
    </>
  );
}
