import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import FunFactBox from "./FunFactBox";

export default function PostGameModal({ open, onClose, isCorrect, stats, puzzle }) {
  if (!puzzle || !stats) return null;

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      const diff = nextMidnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    const message = `I solved today’s Number Origin puzzle in ${
      isCorrect ? stats.currentStreak : "X"
    } attempts! 🧠 #NumberOrigin\n\nPlay now: [your-game-link]`;
    navigator.clipboard.writeText(message);
    alert("Copied to clipboard! Share your result.");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
<DialogContent className="max-w-md p-6 relative bg-white rounded-xl shadow-xl">

  <div className="relative">
    {/* ❌ Close Button */}
    <button
      className="absolute top-0 right-0 text-gray-400 hover:text-black transition z-50"
      onClick={onClose}
      aria-label="Close"
    >
      <X size={20} />
    </button>

    {/* Header and content go here */}
    <DialogHeader className="text-center mb-2">
      <DialogTitle className="text-xl font-bold">
        {isCorrect ? "🎉 You got it!" : "📌 Nice Try!"}
      </DialogTitle>
    </DialogHeader>
  </div>

        {/* Fun Fact */}
        <FunFactBox puzzle={puzzle} />

        {/* 🔥 Streak Count */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-700 font-semibold">🔥 Current Streak</p>
          <p className="text-3xl font-bold text-amber-500">
           {stats?.currentStreak ?? 0} day{stats?.currentStreak === 1 ? "" : "s"}
</p>
        </div>

        {/* ⏳ Countdown */}
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold text-gray-700">Next puzzle in:</p>
          <p className="text-lg font-mono text-gray-900">{countdown}</p>
        </div>

        {/* 📤 Share */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleShare}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-2"
          >
            <Share2 size={16} /> Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
