// components/TrophyEarnedModal.js
"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Trophy, Sparkles } from "lucide-react";

export default function TrophyEarnedModal({
  open,
  onClose,
  category,
  tier,           // 20 | 50 | 100
  tokenGranted,   // boolean
  badgeUrl,       // e.g. /badges/geography-20.png
}) {
  if (!category || !tier) return null;

  const nextTier = tier === 20 ? 50 : tier === 50 ? 100 : null;

  // A small entrance animation via CSS variables (no extra libs).
  useEffect(() => {
    if (!open) return;
    // (If you want a confetti burst here too, you can import canvas-confetti and fire a small one.)
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          relative w-full max-w-md px-4 pb-6 pt-5
          bg-white rounded-2xl shadow-xl
          border border-gray-100
        "
      >
        <button
          className="absolute top-2 right-2 p-1 text-blue-500 hover:text-blue-600"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <DialogHeader className="items-center">
          <div className="flex items-center gap-2 text-emerald-600">
            <Trophy size={22} />
            <DialogTitle className="text-lg">Trophy Unlocked!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-2 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="relative">
            <div
              className="
                absolute inset-0 rounded-full blur-xl opacity-30
                bg-gradient-to-tr from-emerald-300 via-fuchsia-300 to-sky-300
                animate-pulse
              "
              aria-hidden
            />
            <div className="relative rounded-2xl ring-4 ring-emerald-200/60 p-2 bg-white">
              <img
                src={badgeUrl}
                alt={`${category} tier ${tier} badge`}
                className="w-40 h-40 object-contain"
                loading="eager"
              />
            </div>
          </div>

          <h3 className="mt-4 text-xl font-bold">
            {category} — {tier} Solved
          </h3>
          <p className="mt-1 text-sm text-gray-600 max-w-xs">
            Brilliant! You’ve reached the <span className="font-semibold">{tier}</span>-puzzle milestone in
            <span className="font-semibold"> {category}</span>.
          </p>

          {/* Token chip */}
          <div className="mt-3">
            {tokenGranted ? (
              <div
                className="
                  inline-flex items-center gap-2 rounded-full px-3 py-1
                  bg-amber-100 text-amber-800 text-sm font-semibold
                  ring-1 ring-amber-200 animate-[pulse_1.8s_ease-in-out_infinite]
                "
              >
                <Sparkles size={16} />
                +1 Token added to your balance
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                <Sparkles size={16} className="opacity-60" />
                No token this time — keep playing!
              </div>
            )}
          </div>

          {/* Next tier hint */}
          {nextTier && (
            <p className="mt-3 text-xs text-gray-500">
              Next tier: <span className="font-semibold">{nextTier}</span> in {category}. You’ve unlocked the
              {tier === 20 ? " 50-goal progress bar." : " final stretch — go for 100!"}
            </p>
          )}

          {/* Actions */}
          <div className="mt-5 grid grid-cols-2 gap-3 w-full">
            <Button
              onClick={() => {
                // Optional: route to your Number Vault / Trophy Room
                window.location.href = "/number-vault";
              }}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              View Number Vault
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Keep Playing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
