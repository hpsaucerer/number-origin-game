import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import FunFactBox from "./FunFactBox";
import { track } from '@vercel/analytics';
import PostGameHeader from "@/components/PostGameHeader";

export default function PostGameModal({ open, onClose, isCorrect, stats, puzzle, shareResult, attempts }) {

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




  return (
    <Dialog open={open} onOpenChange={onClose}>
<DialogContent className="max-w-md px-4 pt-4 pb-3 relative bg-white rounded-xl shadow-xl">

  <div className="relative">
    {/* ❌ Close Button */}
    <button
      className="absolute top-0 right-0 text-blue-500 hover:text-blue-600 transition z-50"
      onClick={onClose}
      aria-label="Close"
    >
      <X size={28} />
    </button>

<DialogHeader className="p-0 m-0">
 <div className="text-center mb-0 p-0 m-0 border border-red-500">
    <PostGameHeader attempts={attempts} isCorrect={isCorrect} />
  </div>
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
        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-gray-700">Next puzzle in:</p>
          <p className="text-lg font-mono text-gray-900">{countdown}</p>
        </div>

        {/* 📤 Share */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => shareResult()}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-2"
          >
            <Share2 size={16} /> Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
