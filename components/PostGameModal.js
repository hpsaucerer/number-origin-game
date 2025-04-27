import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import FunFactBox from "./FunFactBox";
import { track } from '@vercel/analytics';
import confetti from "canvas-confetti";

const TILE_WORD = "NUMERUS";

const getTileMessage = (count) => {
  switch (count) {
    case 1:
      return "Yay! You've got your first letter!";
    case 2:
      return "Another one in the bag, come back tomorrow for your third!";
    case 3:
      return "Three down, four to go - almost halfway!";
    case 4:
      return "Getting closer to that token now.";
    case 5:
      return "You're on a roll!";
    case 6:
      return "Just one more day, you can do it!";
    case 7:
      return "Whoop! Well done, you've earned a token!";
    default:
      return "";
  }
};

export default function PostGameModal({
  open,
  onClose,
  isCorrect,
  stats,
  puzzle,
  puzzleNumber,
  shareResult,
  attempts,
  earnedTiles,
}) {
  if (!puzzle || !stats) return null;

  const [countdown, setCountdown] = useState("");

  const [justEarnedTile, setJustEarnedTile] = useState(false);
  const [tileAwardedAtOpen, setTileAwardedAtOpen] = useState(0);

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
  if (open) {
    document.body.style.overflow = "hidden";

    const storedTiles = JSON.parse(localStorage.getItem("earnedTiles") || "[]");
    const currentTiles = storedTiles.length;
    const alreadyAwarded = tileAwardedAtOpen;

    if (currentTiles > alreadyAwarded) {
      setJustEarnedTile(true);
      setTileAwardedAtOpen(currentTiles);
    }

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [open, isCorrect]);


  // ✅ Prevent background scroll on mobile when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
      <DialogContent
        className="w-full max-w-md mt-16 px-0 pt-4 pb-3 relative bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* 🔁 Scrollable inner wrapper */}
        <div className="overflow-y-auto max-h-[calc(100dvh-8rem)] px-4 overscroll-contain">

          {/* ❌ Close Button */}
          <button
            className="absolute top-2 right-2 text-blue-500 hover:text-blue-600 transition z-50"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* 🎯 Image & Guess Count */}
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

          {/* ✅ Answer */}
          <div className="mt-4 w-full flex justify-center">
            <div className="bg-green-100 border border-green-300 text-green-800 text-center px-4 py-2 rounded-xl shadow-sm font-semibold text-base max-w-xs w-full">
              The answer was: <span className="block text-sm font-bold mt-1">{puzzle.answer}</span>
            </div>
          </div>
{/* 🎁 Earned Tiles & Token */}
<div className="flex flex-col items-center mt-6">
  {earnedTiles.length > 0 && earnedTiles.length <= TILE_WORD.length && (
<p className="font-semibold mb-4 text-lg text-center" style={{ color: "#63c4a7" }}>
  {getTileMessage(earnedTiles.length)}
</p>
  )}

  <div className={`flex space-x-1 mb-4 ${earnedTiles.length === TILE_WORD.length ? 'mega-celebration' : ''}`}>
    {TILE_WORD.split("").map((letter, index) => {
      const isEarned = earnedTiles.length > index;
      return (
        <div
          key={index}
          className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-2xl
            ${isEarned ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-400'}
            transition-all duration-300 ease-in-out`}
        >
          {letter}
        </div>
      );
    })}
  </div>

  {/* 🏅 Token */}
  {earnedTiles.length === TILE_WORD.length && (
    <div className="flex flex-col items-center">
      <img
        src="/icons/token.png" // 🔥 Your nice token icon path
        alt="Token Earned"
        className="w-20 h-20 animate-pulse token-glow mb-2" // Bigger and glowing
      />
    </div>
  )}
</div>

          {/* 🧠 Fun Fact */}
          <FunFactBox puzzle={puzzle} />


          {/* ⏳ Countdown */}
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-gray-700">Next puzzle in:</p>
            <p className="text-lg font-mono text-gray-900">{countdown}</p>
          </div>

          {/* 📤 Share */}
          <div className="flex justify-center mt-4 mb-2">
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

        </div>
      </DialogContent>
    </Dialog>
  );
}
