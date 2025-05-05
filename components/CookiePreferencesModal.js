"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // You may need this

export default function CookiePreferencesModal({ open, onClose, onSave }) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const storedPrefs = JSON.parse(localStorage.getItem("cookiePreferences") || "{}");
    setAnalyticsEnabled(!!storedPrefs.analytics);
  }, [open]);

  const handleSave = () => {
    onSave({ analytics: analyticsEnabled });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800">Cookie Preferences</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Analytics Cookies</p>
              <p className="text-sm text-gray-500">Helps us understand usage and improve the game.</p>
            </div>
            <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
