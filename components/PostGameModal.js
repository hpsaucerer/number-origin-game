import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart as BarIcon, Share2, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import FunFactBox from "./FunFactBox";

export default function PostGameModal({ open, onClose, isCorrect, stats, puzzle }) {
  const data = [
    { guess: "1", value: stats.guessDistribution[1] },
    { guess: "2", value: stats.guessDistribution[2] },
    { guess: "3", value: stats.guessDistribution[3] },
    { guess: "4", value: stats.guessDistribution[4] },
    { guess: "❌", value: stats.guessDistribution.failed || 0 },
  ];

  const handleShare = () => {
    const message = `I solved today’s Number Origin puzzle in ${
      isCorrect ? stats.currentStreak : "X"
    } attempts! 🧠 #NumberOrigin\n\nPlay now: [your-game-link]`;
    navigator.clipboard.writeText(message);
    alert("Copied to clipboard! Share your result.");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 relative">
        {/* ❌ Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <DialogHeader className="text-center mb-2">
          <DialogTitle className="text-xl font-bold">
            {isCorrect ? "🎉 You got it!" : "📌 Nice Try!"}
          </DialogTitle>
        </DialogHeader>

        {/* Fun Fact */}
        <FunFactBox text={puzzle.funFact} />

        {/* Streak Bar Chart */}
        <div className="mt-6 text-center">
          <h3 className="font-semibold text-sm mb-2">Guess Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="guess" />
              <YAxis allowDecimals={false} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Share Button */}
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
