import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ArchiveIntroModal({ open, onClose }) {
  const handleAccept = () => {
    const today = new Date().toISOString().split("T")[0];

    localStorage.setItem("seenArchiveIntro", "true");
    localStorage.setItem("archiveToken", today);

    const hasUsed = localStorage.getItem("archiveTokenUsed") === "true";
    if (!hasUsed) {
      console.log("🎁 Archive token granted via intro modal.");
    } else {
      console.log("ℹ️ Archive token was already used.");
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-4 rounded shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">🎉 Archive Mode Unlocked!</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3 text-sm text-gray-700">
          <p>
            You can now access previous puzzles — perfect if you’ve missed a day!
          </p>
          <p className="text-gray-600">
            We’re giving you a free archive token to try it out. You’ll be able to earn or buy more soon.
          </p>
        </div>
        <Button
          onClick={handleAccept}
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded"
        >
          🎁 Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
