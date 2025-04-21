import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import FunFactBox from "./FunFactBox";
import { track } from '@vercel/analytics';
import confetti from "canvas-confetti";

export default function PostGameModal({
  open,
  onClose,
  isCorrect,
  stats,
  puzzle,
  puzzleNumber,
  shareResult,
  attempts,
}) {
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

  useEffect(() => {
  if (open && isCorrect) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}, [open, isCorrect]);
  
  const imagePathFor = (attempts, isCorrect) => {
    const key = isCorrect ? attempts + 1 : "failed";
    const map = {
      1: "/gotitinone.png",
      2: "/second.png",
      3: "/thirdtime.png",
      4: "/squeaky.png",
      failed: "/tomorrow.png",
    };
    return map[key];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md px-4 pt-4 pb-3 relative bg-white rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">

        {/* ❌ Close Button */}
        <button
          className="absolute top-2 right-2 text-blue-500 hover:text-blue-600 transition z-50"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Result Image & Guess Count */}
        <div className="flex flex-col items-center pt-2 pb-1">
          <img
            src={imagePathFor(attempts, isCorrect)}
            alt=""
            className="w-36 h-auto block"
          />
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {isCorrect ? `${attempts + 1} of 4 guesses` : `All 4 guesses used`}
          </p>
        </div>

{/* ✅ Answer Bubble */}
<div className="bg-green-100 border border-green-300 text-green-800 text-center px-4 py-2 rounded-xl shadow-sm font-semibold text-sm max-w-xs w-full">
  The answer was:
  <span className="block text-lg font-bold mt-1">{puzzle.answer}</span>
</div>

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
        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-gray-700">Next puzzle in:</p>
          <p className="text-lg font-mono text-gray-900">{countdown}</p>
        </div>

        {/* 📤 Share Button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() =>
              shareResult({
                isCorrect,
                guessCount: isCorrect ? attempts + 1 : 4,
                puzzleNumber,
              })
            }
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-2"
          >
            <Share2 size={16} /> Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
