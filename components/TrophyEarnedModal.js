// components/TrophyEarnedModal.js
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Trophy, Sparkles } from "lucide-react";

// Match the palette used elsewhere (Achievements)
const CATEGORY_COLOR = {
  Maths: "#3b82f6",
  Geography: "#63c4a7",
  Science: "#f57d45",
  History: "#f7c548",
  Culture: "#8e44ad",
  Sport: "#e53935",
};

function hexToRgba(hex, a = 0.35) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function TrophyEarnedModal({
  open,
  onClose,
  category,
  tier,                 // 20 | 50 | 100
  badgeUrl,             // e.g. /badges/geography-20.png
  tokensGranted,        // number (preferred)
  tokenGranted,         // boolean (legacy; if true we'll show +3)
}) {
  if (!category || !tier) return null;

  // Back-compat: if old boolean prop is used, treat it as +3 tokens
  const awarded =
    Number.isFinite(tokensGranted) ? Number(tokensGranted) : (tokenGranted ? 3 : 0);

  const [src, setSrc] = useState(badgeUrl);
  useEffect(() => setSrc(badgeUrl), [badgeUrl]);

  const nextTier = tier === 20 ? 50 : tier === 50 ? 100 : null;

  const accent = CATEGORY_COLOR[category] || "#3b82f6";
  const glow = hexToRgba(accent, 0.35);
  const tokenLabel = awarded === 1 ? "Token" : "Tokens";

  // (Optional) entrance fx hook point
  useEffect(() => {
    if (!open) return;
    // could fire confetti here if desired
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
          {/* Badge with category-colored frame + glow */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-[28px] blur-2xl opacity-40"
              style={{ background: glow }}
              aria-hidden
            />
            <div
              className="relative rounded-2xl p-2 bg-white border-4"
              style={{ borderColor: accent, boxShadow: `0 0 54px ${glow}` }}
            >
              <img
                src={src}
                alt={`${category} tier ${tier} badge`}
                className="w-40 h-40 object-contain"
                loading="eager"
                onError={() => setSrc(`/badges/default-${tier}.png`)}
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
          {awarded > 0 ? (
            <div
              className="
                mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1
                bg-amber-100 text-amber-800 text-sm font-semibold
                ring-1 ring-amber-200
              "
            >
              <Sparkles size={16} />
              +{awarded} {tokenLabel} added to your balance
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 bg-gray-100 text-gray-700 text-sm">
              <Sparkles size={16} className="opacity-60" />
              No tokens this time — keep playing!
            </div>
          )}

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
              onClick={() => (window.location.href = "/number-vault")}
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
