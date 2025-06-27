// components/NumberVaultAnnouncementModal.js
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useRouter } from "next/router";

export default function NumberVaultAnnouncementModal({ open, onClose }) {
  const router = useRouter();

  const handleTakeMeThere = () => {
    onClose();
    router.push("/number-vault");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Info className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-bold">Introducing Number Vault!</h2>
        </div>

        {/* Body */}
        <p className="text-sm">
          We’ve just launched <strong>Number Vault</strong>, your vault of solved puzzles. Scroll through every number you’ve unlocked and revisit any fun fact at will.
        </p>
        <img
          src="/number-vault-preview.png"
          alt="Number Vault preview"
          className="mt-4 mb-4 w-full rounded-lg shadow"
        />
        <p className="text-sm">
          We’ve also rolled out a bunch of bug fixes and performance improvements to keep everything running smoothly.
        </p>

        {/* Footer buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Got it!
          </Button>
          <Button onClick={handleTakeMeThere}>
            Take me there
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
