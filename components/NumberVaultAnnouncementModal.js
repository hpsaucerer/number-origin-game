// components/NumberVaultAnnouncementModal.js
"use client";

import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NumberVaultAnnouncementModal({ open, onClose }) {
  const router = useRouter();
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="text-2xl font-bold">
        Introducing… Number Vault
      </DialogTitle>

      <DialogContent className="space-y-4">
        <p>
          We’ve just launched your new <strong>Number Vault</strong> — a complete record of every number you’ve unlocked.
          Scroll through your solved puzzles, filter by category, and revisit any fun fact at will.
        </p>
        <img
          src="/number-vault-preview.png"
          alt="Screenshot of the Number Vault page"
          className="w-full rounded-md shadow-sm"
        />
        <p className="text-sm text-gray-600">
          Also in this release: post‐game modal scroll fix, UI tweaks, and more under-the-hood improvements.
        </p>
      </DialogContent>

      <DialogFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Got it!
        </Button>
        <Button
          onClick={() => {
            onClose();
            router.push("/number-vault");
          }}
        >
          Take me there
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
