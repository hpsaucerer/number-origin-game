// components/CookieConsentBanner.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-100 border-t border-gray-300 p-4 flex flex-col sm:flex-row justify-between items-center shadow">
      <p className="text-sm text-gray-800 mb-2 sm:mb-0">
        We use cookies to improve your experience and for analytics. By using Numerus, you accept this.
      </p>
      <Button
        className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2 rounded"
        onClick={handleAccept}
      >
        Accept
      </Button>
    </div>
  );
}
