// components/PostGameModal.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import FunFactBox from "./FunFactBox";
import { track } from "@vercel/analytics";
import confetti from "canvas-confetti";
import { getOrCreateDeviceId } from "@/lib/device";
import Leaderboard from "@/components/Leaderboard";
import { fetchCountryCode } from "@/utils/geo";
import { calculatePoints } from "@/utils/game";
import { supabase } from "@/lib/supabase";

// 🆕 trophy helpers + modal
import TrophyEarnedModal from "@/components/TrophyEarnedModal";
import {
  getCompletedDatesFromLocalStorage,
  achievedTier,
  getLastAwardedTier,
  setLastAwardedTier,
  TROPHY_TIERS,
  normaliseCategory,   // normalize labels
  getSimulatedOffset,  // preview-only local offset
  badgeUrlFor,         // build correct badge image path
} from "@/lib/progress";

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

  // 🆕 trophy popup state
  const [trophy, setTrophy] = useState(null); // { category, tier, badgeUrl, tokensGranted }

  // ─── one-time name + per-day submission guard ───
  const todayKey = puzzle ? `submitted-${puzzle.date}` : null;
  const hasName = typeof window !== "undefined" && !!localStorage.getItem("playerName");
  const hasSent = typeof window !== "undefined" && !!localStorage.getItem(todayKey);

  // ─── handleSubmitScore needs todayKey in scope ───
  const handleSubmitScore = useCallback(async () => {
    // 🔒 Never submit scores for archive puzzles
    if (isArchive) return;

    // 1) nickname
    let name = localStorage.getItem("playerName");
    if (!name) {
      name = window.prompt("What should we call you on the leaderboard?")?.trim();
      if (!name) return;
      name = name.replace(/\s+/g, " ");
      localStorage.setItem("playerName", name);
    }

    const countryCode = localStorage.getItem("user_country_code") || null;

    // 2) calculate time + points
    const deviceId = getOrCreateDeviceId();
    const key = `startTime-${puzzle.date}`;
    const storedTime = parseInt(localStorage.getItem(key), 10);
    const baseTime = startTime ?? (Number.isNaN(storedTime) ? Date.now() : storedTime);
    const now = Date.now();
    const timeTaken = Math.floor((now - baseTime) / 1000);
    const pts = calculatePoints(attempts + 1, timeTaken);

    // 3) POST to leaderboard
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
      localStorage.setItem(todayKey, "true");
      alert("You're on the leaderboard!");
      setShowLeaderboard(true);
    } else {
      alert("Something went wrong submitting your score.");
    }
  }, [isArchive, puzzle?.date, attempts, isCorrect, startTime, todayKey]);

  // ─── Countdown until midnight ───
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(24, 0, 0, 0);
      const diff = next - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(`${h}h ${m}m ${s}s`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  // ─── Fetch and store country code once ───
  useEffect(() => {
    if (typeof window === "undefined") return;
    (async () => {
      const existing = localStorage.getItem("user_country_code");
      if (!existing) {
        const code = await fetchCountryCode();
        if (code) localStorage.setItem("user_country_code", code);
      }
    })();
  }, []);

  // 🆕 Award trophy if a tier is newly hit
  const maybeAwardCategoryTrophy = useCallback(async () => {
    if (!isCorrect || isArchive) return;
    if (!puzzle?.category || !puzzle?.date) return;

    // ensure the completion flag is set for today (idempotent)
    const completedKey = `completed-${puzzle.date}`;
    if (localStorage.getItem(completedKey) !== "true") {
      localStorage.setItem(completedKey, "true");
    }

    const dates = getCompletedDatesFromLocalStorage();
    if (dates.length === 0) return;

    // canonical label for robust matching + storage
    const canonicalCategory = normaliseCategory(puzzle.category) || puzzle.category;

    // count this category's solved dates (normalize labels from DB)
    let count = 0;
    try {
      // fetch rows for the user's completed dates only
      const { data, error } = await supabase
        .from("puzzles")
        .select("category,date")
        .in("date", dates);

      let rows;
      if (error) {
        // fall back to full fetch and filter
        const { data: all, error: allErr } = await supabase
          .from("puzzles")
          .select("category,date");
        if (allErr) throw allErr;
        rows = (all || []).filter((p) => dates.includes(p.date));
      } else {
        rows = data || [];
      }

      count = rows.reduce((acc, r) => {
        const cat = normaliseCategory(r.category) || r.category;
        return acc + (cat === canonicalCategory ? 1 : 0);
      }, 0);
    } catch (e) {
      console.warn("Trophy count fetch failed:", e);
      return;
    }

    // preview-only: add local simulation offset
    const countEffective = count + getSimulatedOffset(canonicalCategory);

    // did they newly reach a tier? (20, 50, 100)
    const tier = achievedTier(countEffective, TROPHY_TIERS);
    const last = getLastAwardedTier(canonicalCategory);
    if (!tier || tier <= last) return;

    // --- grant Archive tokens (tries bulk first, falls back to per-token) ---
    async function grantArchiveTokens(amount) {
      const deviceId = getOrCreateDeviceId();

      // 1) Try bulk grant (preferred). Backend should credit "archive" bucket.
      try {
        const res = await fetch("/api/grant-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: deviceId,
            kind: "archive",      // tell the API these are ARCHIVE tokens
            amount,               // grant 3 in a single call if supported
            source: `trophy:${canonicalCategory}:${tier}`,
            note: `Trophy ${tier} in ${canonicalCategory} (bulk ${amount})`,
          }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          const granted = Number(data?.granted ?? amount);

          // opportunistically update any local caches the Archives page might read
          ["archive_token_balance", "archiveTokens"].forEach((k) => {
            const cur = Number(localStorage.getItem(k));
            if (Number.isFinite(cur)) localStorage.setItem(k, String(cur + granted));
          });

          return granted;
        }
      } catch (e) {
        console.warn("Bulk archive token grant failed:", e);
      }

      // 2) Fallback: grant 1-by-1 (works with older API implementations)
      let granted = 0;
      for (let i = 0; i < amount; i++) {
        try {
          const res = await fetch("/api/grant-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              device_id: deviceId,
              kind: "archive",
              amount: 1,
              source: `trophy:${canonicalCategory}:${tier}`,
              note: `Trophy ${tier} in ${canonicalCategory} (fallback ${i + 1}/${amount})`,
            }),
          });
          if (res.ok) granted += 1;
        } catch (e) {
          console.warn("Per-token archive grant failed:", e);
        }
      }

      // update local caches if they exist
      if (granted > 0) {
        ["archive_token_balance", "archiveTokens"].forEach((k) => {
          const cur = Number(localStorage.getItem(k));
          if (Number.isFinite(cur)) localStorage.setItem(k, String(cur + granted));
        });
      }

      return granted;
    }

    const tokensGranted = await grantArchiveTokens(3);

    setLastAwardedTier(canonicalCategory, tier);
    setTrophy({
      category: canonicalCategory,
      tier,
      tokensGranted,
      badgeUrl: badgeUrlFor(canonicalCategory, tier),
    });
  }, [isCorrect, isArchive, puzzle?.category, puzzle?.date]);

  // ─── Tiles, token grant, confetti ───
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    // Earn tiles
    let stored = JSON.parse(localStorage.getItem("earnedTileIndexes") || "[]");
    const earnedToday = localStorage.getItem(`tile-earned-${puzzle.date}`) === "true";
    if (!earnedToday && stored.length < TILE_WORD.length && !isArchive) {
      stored = [...stored, stored.length];
      localStorage.setItem("earnedTileIndexes", JSON.stringify(stored));
      localStorage.setItem(`tile-earned-${puzzle.date}`, "true");
      setEarnedTiles(stored);
      setJustEarnedTile(true);
    } else {
      setEarnedTiles(stored);
    }

    // First-token grant (leave as-is if this already credits archive tokens in your API)
    const granted = localStorage.getItem("firstTokenGranted") === "true";
    if (!isArchive && !granted) {
      const devId = getOrCreateDeviceId();
      fetch("/api/grant-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: devId, source: "first_token_after_game" }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem("firstTokenGranted", "true");
            setShowBonusButton(true);
          }
        });
    }

    // Confetti on correct
    if (isCorrect) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    // check for trophy after solve
    maybeAwardCategoryTrophy();

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isCorrect, puzzle?.date, isArchive, maybeAwardCategoryTrophy]);

  // ─── Auto-submit once per day if they have a name ───
  useEffect(() => {
    if (isCorrect && !isArchive && hasName && !hasSent) {
      handleSubmitScore()
        .then(() => localStorage.setItem(todayKey, "true"))
        .catch(console.error);
    }
  }, [isCorrect, isArchive, hasName, hasSent, handleSubmitScore, todayKey]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-full max-w-md
          mt-8
          px-0 pt-4 pb-8
          relative bg-white rounded-xl shadow-xl
          max-h-[85vh]
          overflow-y-auto
        "
      >
        <button
          className="absolute top-2 right-2 text-blue-500 hover:text-blue-600 transition z-50"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col items-center pt-2 pb-1">
          <img
            src={
              isCorrect
                ? ["/gotitinone.png", "/second.png", "/thirdtime.png", "/squeaky.png"][attempts]
                : "/tomorrow.png"
            }
            alt=""
            className="w-36 h-auto block"
          />
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {isCorrect ? `${attempts + 1} of 4 guesses` : `All 4 guesses used`}
          </p>
        </div>

{/* Answer banner (green strip + white body) */}
<div className="mt-4 w-full px-4 sm:px-0">   {/* <- add side padding on mobile */}
  <div className="w-full max-w-sm mx-auto">
    {/* Top label bar (green) */}
    <div
      className="
        bg-green-100 text-green-900
        text-center text-[10px] sm:text-xs font-semibold tracking-wide uppercase
        border border-green-200 rounded-t-xl
        px-3 py-1
      "
      aria-hidden
    >
      The answer was
    </div>

    {/* Body (white) */}
    <div
      className="
        border border-gray-200 border-t-0
        rounded-b-xl bg-white shadow-sm
      "
    >
      <p className="text-center text-[13px] sm:text-base font-semibold text-gray-900 py-3 px-4 leading-snug">
        {puzzle.answer}
      </p>
    </div>
  </div>
</div>


        {showBonusButton && (
          <div className="flex flex-col items-center mt-3 space-y-2">
            <p className="text-sm text-yellow-600 font-semibold animate-bounce">
              🎁 Try one from the archive!
            </p>
            <Button
              onClick={() => (window.location.href = "/archives")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-md shadow transition"
            >
              Bonus Puzzle
            </Button>
          </div>
        )}

        {!isArchive && (
          <div className="flex flex-col items-center mt-6">
            {earnedTiles.length > 0 && (
              <p className="mb-2 text-center text-brand font-semibold text-sm">
                {getTileMessage(earnedTiles.length)}
              </p>
            )}
            <div className="flex items-center space-x-2">
              {TILE_WORD.split("").map((ltr, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-2xl ${
                    earnedTiles.includes(idx)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-400"
                  } transition-all duration-300 ease-in-out`}
                >
                  {ltr}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCorrect && !isArchive && (
          <>
            {/* only show “Submit Score” if they haven’t got a name AND haven’t sent today */}
            {!hasName && !hasSent && (
              <div className="mt-5 px-4 text-center">
                <p className="text-sm text-gray-700 mb-2">
                  Want to see how you stack up?
                </p>
                <Button
                  onClick={handleSubmitScore}
                  className="bg-[#8E44AD] hover:bg-[#8E44AD] text-white text-sm font-semibold px-4 py-2 rounded shadow"
                >
                  Submit Score to Leaderboard
                </Button>
              </div>
            )}

            {/* always show “View Leaderboard” */}
            <div className="mt-3 px-4 text-center">
              <Button
                onClick={() => setShowLeaderboard(true)}
                className="bg-[#8E44AD] hover:bg-[#8E44AD] text-white text-sm font-semibold px-4 py-2 rounded shadow"
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
      </DialogContent>

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
          puzzleDate={puzzle.date}
        />
      )}

      {/* 🆕 Trophy popup */}
      <TrophyEarnedModal
        open={!!trophy}
        onClose={() => setTrophy(null)}
        category={trophy?.category}
        tier={trophy?.tier}
        badgeUrl={trophy?.badgeUrl}
        tokensGranted={trophy?.tokensGranted}
      />
    </Dialog>
  );
}


