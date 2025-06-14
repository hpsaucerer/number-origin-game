import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import FunFactBox from "./FunFactBox";
import { track } from '@vercel/analytics';
import confetti from "canvas-confetti";
import { getOrCreateDeviceId } from "@/lib/device";
import Leaderboard from "@/components/Leaderboard"; // adjust path if needed
import { fetchCountryCode } from "@/utils/geo";
import { calculatePoints } from "@/utils/game";

const TILE_WORD = "NUMERUS";

const getTileMessage = (count) => {
  switch (count) {
    case 1: return "Yay! You've got your first letter!";
    case 2: return "Another one in the bag, come back tomorrow for your third!";
    case 3: return "Three down, four to go - almost halfway!";
    case 4: return "Getting closer to those tokens now.";
    case 5: return "You're on a roll!";
    case 6: return "Just one more day, you can do it!";
    case 7: return "Whoop! Well done, you've earned some tokens!";
    default: return "";
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
  isArchive,
  startTime,
}) {
  if (!puzzle || !stats) return null;

  const [countdown, setCountdown] = useState("");
  const [earnedTiles, setEarnedTiles] = useState([]);
  const [justEarnedTile, setJustEarnedTile] = useState(false);
  const [showBonusButton, setShowBonusButton] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

   // ——— Only ask when they click “Submit Score to Leaderboard” ———
  const handleSubmitScore = useCallback(async () => {
    // 1) nickname
    let name = localStorage.getItem("playerName");
    if (!name) {
      name = window.prompt("What should we call you on the leaderboard?")?.trim();
      if (!name) return;
      name = name.replace(/\s+/g, " ");
      localStorage.setItem("playerName", name);
    }

  const countryCode = localStorage.getItem("user_country_code") || null;

      // 2) calculate time + points (fallback to the original load time if startTime is missing)
      const deviceId   = getOrCreateDeviceId();
      const key        = `startTime-${puzzle.date}`;
      const storedTime = parseInt(localStorage.getItem(key), 10);
      const baseTime   = startTime ?? (Number.isNaN(storedTime) ? Date.now() : storedTime);
      const now        = Date.now();
      const timeTaken  = Math.floor((now - baseTime) / 1000);
      const pts        = calculatePoints(attempts + 1, timeTaken);

    // 3) POST
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id:      deviceId,
        puzzle_date:    puzzle.date,
        attempts:       isCorrect ? attempts + 1 : 4,
        is_correct:     isCorrect,
        name,
        time_taken_sec: timeTaken,
        points:         pts,
        country_code:   countryCode,
      }),
    });

    if (res.ok) {
      alert("You're on the leaderboard!");
      setShowLeaderboard(true);
    } else {
      alert("Something went wrong submitting your score.");
    }
  }, [puzzle.date, attempts, isCorrect, startTime]);
  
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
  console.log("🧩 puzzle.date:", puzzle.date, "Type:", typeof puzzle.date);
}, [puzzle.date]);

  useEffect(() => {
    if (typeof window === "undefined") return;
  const maybeSetCountry = async () => {
    const existing = localStorage.getItem("user_country_code");
    if (!existing) {
      const code = await fetchCountryCode();
      if (code) {
        localStorage.setItem("user_country_code", code);
        console.log("🌍 Country code stored:", code);
      }
    }
  };
  maybeSetCountry();
}, []);

 const todayKey = puzzle
   ? `submitted-${puzzle.date}` 
   : null;

useEffect(() => {
  if (!open) return;

  document.body.style.overflow = "hidden";

  // compute today’s date once
  const today = new Date().toISOString().split("T")[0];

  // ❏ First window‐guarded block (tile earning)
  if (typeof window !== "undefined") {
    let alreadyAwarded = localStorage.getItem(`tile-earned-${today}`) === "true";
    let storedIndexes  = JSON.parse(localStorage.getItem("earnedTileIndexes") || "[]");

    if (!alreadyAwarded && storedIndexes.length < TILE_WORD.length && !isArchive) {
      const nextIndex = storedIndexes.length;
      const updated   = [...storedIndexes, nextIndex];
      localStorage.setItem("earnedTileIndexes", JSON.stringify(updated));
      localStorage.setItem(`tile-earned-${today}`, "true");
      setEarnedTiles(updated);
      setJustEarnedTile(true);
    } else {
      setEarnedTiles(storedIndexes);
    }
  }  // ← close first window‐guard

  // ❏ Second window‐guarded block (archive token)
  if (typeof window !== "undefined") {
    const hasGranted  = localStorage.getItem("firstTokenGranted") === "true";
    const archiveUsed = localStorage.getItem("archiveTokenUsed") === "true";

    if (!isArchive && !hasGranted) {
      const deviceId = getOrCreateDeviceId();
      fetch("/api/grant-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId, source: "first_token_after_game" }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem("firstTokenGranted", "true");
            setShowBonusButton(true);
          }
        })
        .catch((err) => console.error("❌ Grant token API error:", err));
    }
  }  // ← close second window‐guard

  // ❏ Confetti for correct answers
  if (isCorrect) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

// ─────── auto-submit on solve if not already submitted today ───────
if (
  typeof window !== "undefined" &&
  isCorrect &&
  !isArchive &&
  todayKey &&
  !localStorage.getItem(todayKey)
) {
  handleSubmitScore()
    .then(() => localStorage.setItem(todayKey, "true"))
    .catch(err => console.error("Auto-submit failed:", err));
}

  // ❏ Cleanup when modal closes
  return () => {
    document.body.style.overflow = "";
  };
}, [open, isCorrect, handleSubmitScore]);

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
      <DialogContent className="w-full max-w-md mt-16 px-0 pt-4 pb-3 relative bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100dvh-8rem)] px-4 overscroll-contain">
          <button
            className="absolute top-2 right-2 text-blue-500 hover:text-blue-600 transition z-50"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

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

          <div className="mt-4 w-full flex justify-center">
            <div className="bg-green-100 border border-green-300 text-green-800 text-center px-4 py-2 rounded-xl shadow-sm font-semibold text-base max-w-xs w-full">
              The answer was: <span className="block text-sm font-bold mt-1">{puzzle.answer}</span>
            </div>
          </div>

          {showBonusButton && (
            <div className="flex flex-col items-center mt-3 space-y-2">
              <p className="text-sm text-yellow-600 font-semibold animate-bounce">
                🎁 Try one from the archive!
              </p>
              <Button
                onClick={() => {
                  window.location.href = "/archives";
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-md shadow transition"
              >
                Bonus Puzzle
              </Button>
            </div>
          )}

          {/* ✅ Only show NUMERUS tile progress for daily puzzles */}
          {!isArchive && (
            <div className="flex flex-col items-center mt-6">
              {earnedTiles.length > 0 && (
                <p className="mb-2 text-center text-brand font-semibold text-sm">
                  {getTileMessage(earnedTiles.length)}
                </p>
              )}

              <div className="flex items-center space-x-2">
                {TILE_WORD.split("").map((letter, index) => {
                  const isEarned = earnedTiles.includes(index);
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
                {earnedTiles.length === TILE_WORD.length && (
                  <img
                    src="/icons/token.png"
                    alt="Token Earned"
                    className="w-12 h-12 token-pulse ml-2"
                  />
                )}
              </div>
            </div>
          )}
 {isCorrect && !isArchive && !localStorage.getItem(todayKey) && (
   <>
     <div className="mt-5 px-4 text-center">
       <p className="text-sm text-gray-700 mb-2">Want to see how you stack up?</p>
       <Button
         onClick={handleSubmitScore}
         className="bg-[#8E44AD] hover:bg-[#8e44ad] text-white text-sm font-semibold px-4 py-2 rounded shadow"
       >
         Submit Score to Leaderboard
       </Button>
     </div>

     <div className="flex justify-center mt-5">
       <Button
         onClick={() => setShowLeaderboard(true)}
         className="bg-[#8E44AD] hover:bg-[#8e44ad] text-white text-sm font-semibold px-4 py-2 rounded shadow"
       >
         View Leaderboard
       </Button>
     </div>
   </>
 )}

          <FunFactBox puzzle={puzzle} />

          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-gray-700">Next puzzle in:</p>
            <p className="text-lg font-mono text-gray-900">{countdown}</p>
          </div>

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
      {showLeaderboard && (
      <Leaderboard
  onClose={() => setShowLeaderboard(false)}
  puzzleDate={puzzle.date}
/>
)}
      </DialogContent>
    </Dialog>
  );
}
