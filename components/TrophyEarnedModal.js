// components/TrophyEarnedModal.js
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TrophyEarnedModal({ open, onClose, category, tier, badgeUrl, tokenGranted }) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-xl">You earned a {category} badge!</DialogTitle>
        </DialogHeader>

        {badgeUrl ? (
          <img src={badgeUrl} alt={`${category} badge`} className="mx-auto w-24 h-24 my-2" />
        ) : null}

        <p className="mt-2">
          Congrats — you’ve completed <b>{tier}</b> {category} puzzles.
        </p>
        {tokenGranted ? <p className="mt-1">🎟️ A token has been added to your account.</p> : null}

        <button
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
          onClick={onClose}
        >
          Awesome!
        </button>
      </DialogContent>
    </Dialog>
  );
}
