"use client";

import { useState, useEffect } from "react";
import { BarChart, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useRef } from "react";
import FunFactBox from "../components/FunFactBox";
import PostGameModal from "../components/PostGameModal";
import { X } from "lucide-react";
import { shareResult } from "../utils/share";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { isCorrectGuess, isCloseGuess, isValidGuess, revealNextClue, updateStats } from "../utils/game";
import ComingSoon from "../components/ComingSoon";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { BookOpen } from "lucide-react";
import Header from "@/components/ui/header";
import useStats from "@/hooks/useStats";
import { track } from '@vercel/analytics';
import { fetchAllPuzzles, fetchTodayPuzzle } from "@/lib/api";
import Fuse from "fuse.js";
import Joyride from "react-joyride";
import StatsModal from "@/components/modals/StatsModal";
import FeedbackBox from "@/components/FeedbackBox";
import { supabase } from "@/lib/supabase"; // or wherever your `supabase.js` file lives
import AchievementsModal from "@/components/AchievementsModal";

const DEBUG_MODE = false; // set to false later when live if you want

function debugLog(...args) {
  if (!DEBUG_MODE || process.env.NODE_ENV === "production") return;

  const forbiddenFields = ["answer", "acceptable_guesses", "essential_keywords", "keywords", "clues"];

  const hasForbidden = args.some(arg =>
    typeof arg === "object" &&
    arg !== null &&
    forbiddenFields.some(field => field in arg)
  );

  if (hasForbidden) {
    console.warn("[DEBUG BLOCKED] Sensitive object detected, skipping log.");
    return;
  }

  console.log("[DEBUG]", ...args);
}


// 🔁 Synonym replacement map for flexible matching
const synonymMap = {
  quickest: "fastest",
  rapid: "fast",
  speedy: "fast",
  rubix: "rubik",
  rubicks: "rubik",
  "rubik's": "rubik",
  square: "squares",
  usa: "united states",
  uk: "united kingdom",
  number: "amount",
  figure: "amount",
  largest: "biggest",
  smallest: "lowest",
  "100 meter": "100m",
  "100 metre": "100m",
  mens: "men's",
  "men's": "mens",
  dash: "sprint",
  run: "sprint",
  murdered: "assassination",
  killed: "assassination",
  length: "distance",
  domains: "kingdoms",
  movies: "films",
  cats: "cat",
  types: "species",
  meters: "metres",
  gravitational: "gravity",
  mountain: "mount",
  works: "plays",
  highest: "maximum",
  meters: "metres",
  length: "distance",
  shirt: "jersey",
  top: "jersey",
  vest: "jersey",
};

const normalize = (str) =>
  str
    .toLowerCase()
    .replace(/[’'`]/g, "")               // ← NEW: apostrophe cleanup
    .replace(/[^a-z0-9\s]/g, "")         // existing: strip other punctuation
    .split(" ")
    .map((word) => synonymMap[word] || word)
    .join(" ")
    .trim();


  const evaluateGuessKeywords = (guess, { essential = [], required = [] }) => {
  const normalizedGuess = normalize(guess);
  const normalizedTokens = normalizedGuess.split(/\W+/); // ✅ split once
  const normalizedEssential = essential.map(normalize);
  const normalizedRequired = required.map(normalize);

  const matchedEssential = normalizedEssential.filter((kw) =>
    normalizedTokens.includes(kw)
  );

  const matchedRequired = normalizedRequired.filter((kw) =>
    normalizedTokens.includes(kw)
  );

  const hasStrongMatch = matchedEssential.length > 0;
  const hasWeakMatch = matchedRequired.length > 0;
  const matchCount = matchedEssential.length + matchedRequired.length;
  const requiredMatched = matchedRequired.length > 0;

  return {
    matchCount,
    hasStrongMatch,
    hasWeakMatch,
    requiredMatched,
    matchedEssential,
    matchedRequired,
  };
};

const DEV_MODE = false;

const colorClassMap = {
  blue: "text-blue-700 bg-blue-100 hover:bg-blue-200",
  green: "text-green-700 bg-green-100 hover:bg-green-200",
  maroon: "text-red-900 bg-red-100 hover:bg-red-200",
  yellow: "text-yellow-700 bg-yellow-100 hover:bg-yellow-200",
  purple: "text-purple-700 bg-purple-100 hover:bg-purple-200",
  red: "text-red-700 bg-red-100 hover:bg-red-200",
};
const categoryColorMap = {
  Maths: "#3b82f6",      // blue
  Geography: "#63c4a7",  // green
  Science: "#f57d45",    // orange
  History: "#f7c548",    // yellow
  Culture: "#8e44ad",    // purple
  Sport: "#e53935",      // red
};

  export default function Home() {

const joyrideSteps = [
  {
    target: ".daily-number",
    content: "Welcome to Numerus - the daily reverse trivia game. This is today's number. Can you figure out what it represents?",
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".guess-input",
    content: (
      <div>
        <p>
          Type what you think the number could relate to; e.g. <em>'keys on a piano'</em>, <em>'moon landing'</em> etc.
        </p>
        <p>
          <strong>You have 4 guesses to solve the puzzle.</strong>
        </p>
      </div>
    ),
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".reveal-button",
    content: "Need help? Reveal a clue! Remember though, each time you do, this uses up a guess.",
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".achievements-button",
    content: "Tap the trophy icon to view your achievements — including category progress and tiles earned!",
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".stats-button",
    content: "Track your daily streaks and puzzle stats here.",
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
];

    
  const { stats, setStats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();
    const incorrectGuessMessages = [
    "Incorrect - here's a clue to help you!",
    "Hmm, not quite. Keep thinking!",
    "Last clue! Take a deep breath and go for it.",
  ];
    
  const [dateString, setDateString] = useState("");
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [revealedClues, setRevealedClues] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [inputError, setInputError] = useState("");
  const [showPostGame, setShowPostGame] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(null);
  const [revealDisabled, setRevealDisabled] = useState(false);
  const [animateClueButton, setAnimateClueButton] = useState(true);
  const [tokenCount, setTokenCount] = useState(0);
  const [justEarnedToken, setJustEarnedToken] = useState(false);
  const [categoryRevealed, setCategoryRevealed] = useState(false);
  const [spendingToken, setSpendingToken] = useState(false); // Optional: UI animation later
  const [showAchievements, setShowAchievements] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState([]);

const [hasMounted, setHasMounted] = useState(false);
const [allPuzzles, setAllPuzzles] = useState([]);
const [puzzle, setPuzzle] = useState(null);
const [puzzleNumber, setPuzzleNumber] = useState(null);

const [localDate, setLocalDate] = useState("");

const [showTour, setShowTour] = useState(false);
const [stepIndex, setStepIndex] = useState(0);
const [tourKey, setTourKey] = useState(Date.now()); // forces  reset if needed
const [readyToRunTour, setReadyToRunTour] = useState(false);

const TILE_WORD = "NUMERUS";
const [earnedTiles, setEarnedTiles] = useState([]);
const [categoryAchievements, setCategoryAchievements] = useState({});

useEffect(() => {
  if (!allPuzzles.length) return;

  const completedCategories = {};

  const completedPuzzleIds = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");

  allPuzzles.forEach((puzzle) => {
    if (completedPuzzleIds.includes(puzzle.id)) {
      completedCategories[puzzle.category] = true;
    }
  });

  setCategoryAchievements(completedCategories);
}, [allPuzzles]);

useEffect(() => {
  const resetTime = parseInt(localStorage.getItem("resetTilesAt") || "0", 10);
  const now = Date.now();

  if (resetTime && now >= resetTime) {
    console.log("🔄 It's a new day! Resetting earned tiles.");
    localStorage.setItem("earnedTiles", "[]");
    localStorage.removeItem("resetTilesAt"); // clean up
    setEarnedTiles([]);
  }
}, []);

useEffect(() => {
  const storedTiles = JSON.parse(localStorage.getItem("earnedTiles") || "[]");
  setEarnedTiles(storedTiles);
}, []);

useEffect(() => {
  const storedTokens = parseInt(localStorage.getItem("freeToken") || "0", 10);
  setTokenCount(storedTokens);
}, []);

useEffect(() => {
  if (!puzzle || !hasMounted || localStorage.getItem("seenTour") === "true") return;

  let attempts = 0;
  const maxTries = 10;

  const tryStartTour = () => {
    const input = document.querySelector(".guess-input");
    const clue = document.querySelector(".reveal-button");
    const daily = document.querySelector(".daily-number");
    const stats = document.querySelector(".stats-button");

    if (daily && input && clue && stats) {
      debugLog("✅ Joyride: All targets found.");
      setStepIndex(0);
      setTourKey(Date.now());
      setShowTour(true);
      setReadyToRunTour(true);
    } else if (attempts < maxTries) {
      attempts++;
      console.warn(`⏳ Joyride waiting... attempt ${attempts}`);
      setTimeout(tryStartTour, 300);
    } else {
      console.error("❌ Joyride failed: Targets not found.");
    }
  };

  // Delay check until after render
  setTimeout(tryStartTour, 300);
}, [puzzle, hasMounted]);

  
useEffect(() => {
  const now = new Date().toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
  });
  setLocalDate(now);
}, []);

useEffect(() => {
  setHasMounted(true);
}, []);

useEffect(() => {
  const existingId = localStorage.getItem("deviceId");
  if (!existingId) {
    const newId = crypto.randomUUID();
    localStorage.setItem("deviceId", newId);
  }
}, []);

useEffect(() => {
  if (!puzzle) return;

  const gameState = {
    attempts,
    revealedClues,
    isCorrect,
    guess,
  };

  localStorage.setItem(`gameState-${puzzle.date}`, JSON.stringify(gameState));
}, [puzzle, attempts, revealedClues, isCorrect, guess]);

useEffect(() => {
  async function loadPuzzles() {
    const all = await fetchAllPuzzles();
    setAllPuzzles(all);

    let completed = JSON.parse(localStorage.getItem("completedPuzzles") || "null");

    if (!Array.isArray(completed)) {
      completed = [];

      all.forEach((p) => {
        if (localStorage.getItem(`completed-${p.date}`) === "true") {
          completed.push(p.id);
        }
      });

      localStorage.setItem("completedPuzzles", JSON.stringify(completed));
      console.log(
        completed.length > 0
          ? "✅ Migrated old completions to completedPuzzles."
          : "🆕 No old completions found. Initialized empty completedPuzzles."
      );
    }

    setCompletedPuzzles(completed);

    if (DEV_MODE && selectedPuzzleIndex !== null) {
      const devPuzzle = all[selectedPuzzleIndex];
      debugLog("🔧 DEV PUZZLE loaded.");
      setPuzzle(devPuzzle);
      setPuzzleNumber(selectedPuzzleIndex + 1);
    } else {
      const today = await fetchTodayPuzzle();
      if (today) {
        debugLog("✅ Today's puzzle loaded.");
        setPuzzle(today);

        const index = all.findIndex((p) => p.id === today.id);
        setPuzzleNumber(index + 1);
      } else {
        console.warn("⚠️ No puzzle returned for today.");
      }
    }
  }

  loadPuzzles();
}, [selectedPuzzleIndex]);


  const maxGuesses = 4;
  const gameOver = isCorrect || attempts >= maxGuesses;

const getCountdownToMidnightUK = () => {
  const now = new Date();
  const ukNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));

  const midnightUK = new Date(ukNow);
  midnightUK.setHours(24, 0, 0, 0); // midnight UK time

  const diff = midnightUK - ukNow;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const [countdown, setCountdown] = useState(getCountdownToMidnightUK());

useEffect(() => {
  const interval = setInterval(() => {
    setCountdown(getCountdownToMidnightUK());
  }, 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  if (!puzzle) return;

  const alreadyCompleted = localStorage.getItem(`completed-${puzzle.date}`) === "true";
  if (alreadyCompleted) {
    setIsCorrect(true);
    // Clean up any leftover game state for this puzzle
    localStorage.removeItem(`gameState-${puzzle.date}`);
  }
}, [puzzle]);


    useEffect(() => {
  if (puzzle && DEV_MODE) {
    // 🔁 Reset game state when switching puzzles in dev mode
    localStorage.removeItem(`completed-${puzzle.date}`);
    setIsCorrect(false);
    setAttempts(0);
    setRevealedClues([]);
    setGuess("");
    setInputError("");
  }
}, [puzzle]);


function awardTile() {
  const storedTiles = JSON.parse(localStorage.getItem("earnedTiles") || "[]");

  if (storedTiles.length >= TILE_WORD.length) {
    console.log("✅ Already earned all tiles, no action.");
    return;
  }

  const puzzleDate = puzzle?.date;
  if (!puzzleDate) return;

  if (localStorage.getItem(`tile-earned-${puzzleDate}`) === "true") {
    console.log("⏳ Tile already awarded for today.");
    return;
  }

  const nextLetter = TILE_WORD[storedTiles.length];
  const newTiles = Array.from(new Set([...storedTiles, nextLetter]));

  localStorage.setItem("earnedTiles", JSON.stringify(newTiles));
  localStorage.setItem(`tile-earned-${puzzleDate}`, "true"); // ✅ Prevent duplicate award
  setEarnedTiles(newTiles);

  if (newTiles.length === TILE_WORD.length) {
    let currentTokens = parseInt(localStorage.getItem("freeToken") || "0", 10);
    localStorage.setItem("freeToken", (currentTokens + 1).toString());
    setTokenCount(currentTokens + 1);
    setJustEarnedToken(true);

    console.log("🏅 Completed NUMERUS! Awarded 1 free token.");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    localStorage.setItem("resetTilesAt", tomorrow.getTime().toString());
  }
}


const handleGuess = async (isClueReveal = false) => {
  const cleanedGuess = normalize(guess);
  const puzzleId = puzzle?.id ?? 0;

  const {
    matchCount,
    hasStrongMatch,
    hasWeakMatch,
    requiredMatched,
    matchedEssential,
    matchedRequired,
  } = evaluateGuessKeywords(cleanedGuess, {
    essential: puzzle.essential_keywords,
    required: puzzle.keywords || [],
  });

  debugLog("Matched Essential:", matchedEssential, "from:", cleanedGuess);
  debugLog("Essential keywords:", puzzle.essential_keywords);
  
  if (!isClueReveal && !cleanedGuess) {
    setInputError("Please enter a guess before submitting.");
    return;
  }

  setInputError("");

  try {
    if (isClueReveal) {
      const res = await fetch("/api/validate-guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guess: cleanedGuess,
          attempt: attempts,
          puzzleId,
          isClueReveal,
        }),
      });

      const result = await res.json();
      if (result.nextClue) {
        setRevealedClues((prev) => [...prev, result.nextClue]);
      }
      setAttempts((prev) => prev + 1);
      return;
    }

    const allAnswers = [
      { label: normalize(puzzle.answer) },
      ...(puzzle.acceptableGuesses || puzzle.acceptable_guesses || []).map((g) => ({
        label: normalize(g),
      })),
    ];

    const fuse = new Fuse(allAnswers, {
      keys: ["label"],
      threshold: 0.4,
      distance: 100,
      ignoreLocation: true,
      includeScore: true,
    });

    const [bestMatch] = fuse.search(cleanedGuess);

    const normalizedGuess = cleanedGuess.replace(/\s+/g, '');
    const acceptableStrings = puzzle.acceptableGuesses || puzzle.acceptable_guesses || [];

    const exactAcceptableMatch = acceptableStrings.some(
      g => normalize(g).replace(/\s+/g, '') === normalizedGuess
    );

    const isExactAnswerMatch = normalize(puzzle.answer) === cleanedGuess;

    const acceptableFuse = new Fuse(
      acceptableStrings.map(g => ({ label: normalize(g) })),
      {
        keys: ["label"],
        threshold: 0.4,
        distance: 100,
        ignoreLocation: true,
      }
    );

    const acceptableResults = acceptableFuse.search(cleanedGuess);
    const isAcceptableGuess = acceptableResults.some(r => r.score <= 0.3); // tighter match threshold

    const essentialMatchCount = matchedEssential.length;
    const strongEssentialHit = essentialMatchCount >= 2;
    const nearMissEssential = essentialMatchCount === 1;


    debugLog("Checking guess validity. Cleaned guess:", cleanedGuess);
    debugLog("isAcceptableGuess?", isAcceptableGuess);
    debugLog("Is exact match achieved?", isExactAnswerMatch);
    debugLog("Essential match count:", essentialMatchCount);

  const isCorrectGuess =
  isExactAnswerMatch ||
  exactAcceptableMatch ||
  isAcceptableGuess ||
  (
    bestMatch?.score <= 0.65 &&
    hasStrongMatch &&
    requiredMatched &&
    strongEssentialHit // ✅ now required within fuzzy logic
  );

// ✅ Log the guess to Supabase with error handling
const { error } = await supabase.from("Player_responses").insert([
  {
    puzzle_id: puzzleId.toString(),
    raw_guess: guess,
    cleaned_guess: cleanedGuess,
    is_correct: isCorrectGuess,
    attempt: attempts + 1,
    device_id: localStorage.getItem("deviceId") || "unknown",
  }
]);

if (error) {
  console.error("❌ Supabase insert error:", error);
} else {
  console.log("✅ Guess successfully logged to Supabase!");
}


    if (isCorrectGuess) {
      // ✅ Correct guess
      setIsCorrect(true);
      localStorage.setItem(`completed-${puzzle.date}`, "true");
      const existingCompleted = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");
      if (!existingCompleted.includes(puzzle.id)) {
       existingCompleted.push(puzzle.id);
       localStorage.setItem("completedPuzzles", JSON.stringify(existingCompleted));
   }

      setStats((prev) => updateStats(prev, true, attempts + 1));
      setGuess("");

      if (typeof track === "function") {
        track("puzzle_completed", {
          correct: true,
          guessCount: attempts + 1,
          puzzleId,
        });
        track("puzzle_guess_count", {
          guessCount: attempts + 1,
          puzzleId,
        });
      }
      awardTile();
      setTimeout(() => setShowPostGame(true), 500);
    } else if (nearMissEssential || hasWeakMatch || (hasStrongMatch && !requiredMatched)) {
      // 🤏 Close guess
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const clueToReveal = puzzle.clues?.[revealedClues.length];
      if (clueToReveal) {
        setRevealedClues((prev) => [...prev, clueToReveal]);
      }

      setInputError(
  nearMissEssential
    ? "You're close — try adding a more specific word!"
    : "You're on the right track!"
);


      if (newAttempts >= maxGuesses) {
        setStats((prev) => updateStats(prev, false));
        if (typeof track === "function") {
          track("puzzle_failed", { correct: false, attempts: newAttempts, puzzleId });
          track("puzzle_guess_count", { guessCount: "✖", puzzleId });
        }
        awardTile();
        setTimeout(() => setShowPostGame(true), 500);
      }

    } else {
      // ❌ Incorrect guess
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const clueToReveal = puzzle.clues?.[revealedClues.length];
      if (clueToReveal) {
        setRevealedClues((prev) => [...prev, clueToReveal]);
      }

      if (newAttempts >= maxGuesses) {
        setStats((prev) => updateStats(prev, false));
        if (typeof track === "function") {
          track("puzzle_failed", { correct: false, attempts: newAttempts, puzzleId });
          track("puzzle_guess_count", { guessCount: "✖", puzzleId });
        }
        setTimeout(() => setShowPostGame(true), 500);
      } else {
        setInputError("Hmm, not quite. Try again or reveal a clue!");
      }

      setGuess("");
    }
  } catch (error) {
    console.error("❌ Error in handleGuess:", error);
    setInputError("Something went wrong. Try again!");
  }
};


    
const handleClueReveal = () => {
  if (
    revealDisabled || 
    attempts >= maxGuesses || 
    revealedClues.length >= puzzle?.clues?.length
  ) return;

  setRevealDisabled(true);
  setAnimateClueButton(false);

  handleGuess(true);

  setTimeout(() => {
    setRevealDisabled(false);
    setAnimateClueButton(true);
  }, 1000);
};

const handleRevealCategory = () => {
  if (tokenCount <= 0 || categoryRevealed || !puzzle) return;

  setSpendingToken(true);

  setTimeout(() => {
    setTokenCount((prev) => {
      const newCount = prev - 1;
      localStorage.setItem("freeToken", newCount.toString());
      return newCount;
    });
    setCategoryRevealed(true);
    setSpendingToken(false);
  }, 1000); // small delay to allow for nice animation if you want
};


const shareTextHandler = () => {
  shareResult({
  isCorrect,
  guessCount: attempts + 1,    // ✅ Convert attempts to final guess count
  puzzleNumber,                // ✅ Pass the actual puzzle number
});



  // Optional analytics tracking
  if (typeof track === "function") {
    track("share_clicked", {
      correct: isCorrect,
      attempts: attempts,
      puzzleId: puzzle?.id ?? null,
    });
  }
};


return !hasMounted ? (
  <div className="text-center py-10 text-gray-500">Loading...</div>
) : !puzzle ? (
  <ComingSoon nextDate={countdown} />
) : (
<>

 <Joyride
  key={tourKey}
  steps={joyrideSteps}
  run={showTour && readyToRunTour}
  stepIndex={stepIndex}
  continuous
  showSkipButton
  showProgress
  scrollToFirstStep
  disableOverlayClose
  spotlightClicks={false}
  showBeacon={false}
  styles={{
    options: {
      primaryColor: "#3B82F6",
      zIndex: 99999,
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    spotlight: {
      boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.7)",
    },
  }}
  locale={{                      // ✅ Moved inside the Joyride component props
    last: "Play",
    back: "Back",
    next: "Next",
    skip: "Skip",
  }}

callback={(data) => {
  debugLog("🔄 Joyride event:", data);

  // End tour if finished or skipped
  if (data.status === "finished" || data.status === "skipped") {
    setShowTour(false);
    localStorage.setItem("seenTour", "true");
    return;
  }

// Handle advancing between steps
if (data.type === "step:after") {
  const nextStep = stepIndex + 1;

  // ✅ End the tour if there are no more steps
  if (nextStep >= joyrideSteps.length) {
    debugLog("✅ All Joyride steps complete!");
    setShowTour(false);
    localStorage.setItem("seenTour", "true");
    return;
  }

  const nextTargetSelector = joyrideSteps[nextStep]?.target;

  if (nextTargetSelector) {
    const nextTarget = document.querySelector(nextTargetSelector);

    if (nextTarget) {
      setStepIndex(nextStep);
    } else {
      // Retry after delay in case of late-rendered element
      console.warn(`⏳ Waiting for next Joyride step target: ${nextTargetSelector}`);
      setTimeout(() => {
        const retryTarget = document.querySelector(nextTargetSelector);
        if (retryTarget) {
          debugLog(`✅ Retry succeeded: advancing to step ${nextStep}`);
          setStepIndex(nextStep);
        } else {
          console.warn(`❌ Still missing Joyride step target after retry: ${nextTargetSelector}`);
          setShowTour(false);
        }
      }, 500); // Retry after 0.5s
    }
  }
}


  // Handle missing target during step render
  if (data.type === "target:notFound") {
    console.warn("🚫 Joyride target not found:", data.step.target);
    setShowTour(false);
  }
}}
/> 
<Header
  onStatsClick={() => setShowStats(true)}
  onAchievementsClick={() => setShowAchievements(true)}
/>

<div className="max-w-screen-lg mx-auto px-4 md:px-8 flex flex-col items-center space-y-4 bg-white min-h-screen">


{DEV_MODE && (
  <div className="mb-2 flex flex-col items-center">
    <label htmlFor="puzzleSelector" className="text-sm font-medium mb-1 text-gray-700">🛠 Dev: Select a Puzzle</label>
    <select
      id="puzzleSelector"
      value={selectedPuzzleIndex ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        setSelectedPuzzleIndex(value === "" ? null : parseInt(value));
      }}
      className="border px-2 py-1 rounded text-sm text-gray-700"
    >
      <option value="">Today’s puzzle</option>
{allPuzzles.map((p, i) => (
  <option key={p.id} value={i}>
    #{i + 1} — {p.date} — {p.number}
  </option>
))}

    </select>
  </div>
)}

             
      <h1 className="text-2xl font-bold mt-2">Today's number is:</h1>

<Card className="w-full max-w-md p-1 text-center border-2 border-[#3B82F6] bg-white shadow-lg relative">
  <CardContent className="relative">

    {/* 🟡 Token Counter INSIDE Card */}
    <div className="absolute top-2 right-2 z-10 md:z-10 lg:z-10">
      <div className={`bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md
        ${justEarnedToken ? "token-pop token-glow" : ""} 
        ${spendingToken ? "animate-token-spin" : ""}
      `}>
        {tokenCount}
      </div>

      {/* Whoosh animation if just earned */}
      {justEarnedToken && (
        <div className="absolute top-2 right-2 z-10 md:z-10 lg:z-10">
          <div className="bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md token-whoosh">
            🏅
          </div>
        </div>
      )}
    </div>

<PostGameModal
  open={showPostGame}
  onClose={() => setShowPostGame(false)}
  isCorrect={isCorrect}
  stats={stats}
  puzzle={puzzle}
  shareResult={shareTextHandler}
  attempts={attempts}
  puzzleNumber={puzzleNumber} // ✅ Add this
  earnedTiles={earnedTiles}
/>
   
           
<p className="text-4xl font-bold text-[#3B82F6] font-daysone daily-number">
  {(isCorrect ||
    (puzzle.revealFormattedAt &&
      revealedClues.length >= puzzle.revealFormattedAt))
    ? puzzle.formatted
    : puzzle.number}
</p>

          <div className="flex space-x-2 mt-2">
            {Array.from({ length: attempts }, (_, i) => (
              <img
                key={i}
                src="/icons/guess-dot.png"
                alt="Guess Icon"
                className="w-5 h-5"
              />
            ))}
          </div>

{revealedClues.map((clue, index) => (
  <p key={index} className="mt-2 text-gray-600">
    <span className="font-semibold">Clue {index + 1}:</span>{" "}
    {clue.replace("formatted", puzzle.formatted)}
  </p>
))}

{categoryRevealed && puzzle.category && (
  <div className="mt-4 text-center flex flex-col items-center">
    <p className="text-sm font-semibold text-gray-700">
      Category:
    </p>
    <div className="flex items-center gap-2 mt-1">
      {/* 📸 Category Icon */}
      <img
        src={`/icons/${puzzle.category.toLowerCase()}.png`}
        alt={`${puzzle.category} icon`}
        className="w-10 h-10 inline-block"
      />
      {/* Category Name */}
      <p
        className="text-xl font-bold"
        style={{ color: categoryColorMap[puzzle.category] || "#000" }}
      >
        {puzzle.category}
      </p>
    </div>
  </div>
)}


{/* 🔄 Active Game UI */}
{!isCorrect && attempts < maxGuesses && (
  <div className="w-full max-w-md space-y-4 mt-6">
    {/* Guess count */}
    <p className="text-sm text-gray-600 text-center">
      {maxGuesses - attempts} guess{maxGuesses - attempts !== 1 ? "es" : ""} remaining
    </p>

    {/* Guess input */}
    <Input
      value={guess}
      onChange={(e) => setGuess(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (guess.trim()) handleGuess();
        }
      }}
      placeholder="Enter your guess..."
      className="w-full guess-input"
      disabled={!puzzle}
    />

    {/* Buttons */}
    {inputError && (
      <p className="text-red-500 text-sm text-center">{inputError}</p>
    )}

    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mt-2">
<Button
  onClick={handleClueReveal}
  disabled={
    revealDisabled ||
    !puzzle ||
    gameOver ||
    revealedClues.length >= puzzle?.clues?.length
  }
  variant="outline"
  className={`reveal-button w-full transition-transform duration-300 ease-in-out ${
    animateClueButton && revealedClues.length < puzzle.clues.length
      ? "animate-pulse-grow"
      : ""
  }`}
>
  {revealedClues.length >= puzzle?.clues?.length ? "No more clues" : "Reveal a Clue"}
</Button>
{tokenCount > 0 && !categoryRevealed && (
<Button
  onClick={handleRevealCategory}
  className="w-full text-white hover:opacity-90"
  className="w-full text-white bg-[#f7c548] hover:opacity-90"
  disabled={spendingToken}
>
  {spendingToken ? "Revealing..." : "Reveal Category (1 Token)"}
</Button>

)}

<Button
  onClick={() => handleGuess()} // ✅ Safe and explicit
  className="w-full bg-[#3B82F6] text-white"
>
  Submit
</Button>

    </div>
  </div>
)}

{/* ✅ Correct Answer UI */}
{isCorrect && (
  <div className="mt-6 text-center space-y-3">
    <p className="text-green-600">Correct! The answer is {puzzle.answer}.</p>
    <p className="text-lg font-semibold text-gray-800">Come back tomorrow for your next workout!</p>
    <p className="text-sm text-gray-600">
      Next puzzle in: <span className="font-mono">{countdown}</span>
    </p>
    <FeedbackBox />
  </div>
)}

{/* ❌ Out of Guesses UI */}
{!isCorrect && attempts >= maxGuesses && (
  <div className="mt-6 text-center space-y-3">
    <p className="text-red-600">Unlucky, better luck tomorrow! The correct answer was {puzzle.answer}.</p>
    <p className="text-lg font-semibold text-gray-800">Come back tomorrow for your next workout!</p>
    <p className="text-sm text-gray-600">
      Next puzzle in: <span className="font-mono">{countdown}</span>
    </p>
    <FeedbackBox />
  </div>
)}
</CardContent>
</Card>

      <div className="flex flex-col items-center mt-4">
{localDate && (
  <p className="text-lg font-semibold">{localDate}</p>
)}

      <p className="text-md font-medium">Numerus #{puzzleNumber}</p>

      </div>

{gameOver && (
  <Button
    onClick={shareTextHandler}
    className="flex items-center space-x-2"
  >
    <Share2 size={16} />
    <span>Share</span>
  </Button>
)}


      {/* Instructions Popup */}
<Dialog open={showInstructions} onOpenChange={setShowInstructions}>
   <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
  <DialogContent className="relative max-h-[90vh] overflow-y-auto pt-3 px-4 pb-4 sm:max-w-md w-full flex flex-col items-start justify-center">
    {/* Dismiss Button */}
    <button
      className="absolute top-1 right-1 p-2 text-blue-500 hover:text-blue-600 transition"
      onClick={() => setShowInstructions(false)}
      aria-label="Close"
    >
      <X size={28} />
    </button>

<DialogHeader className="w-full">
  <DialogTitle>
    <h2 className="text-lg text-gray-800 text-left">How To Play</h2>
  </DialogTitle>
</DialogHeader>

<div className="mt-2 font-vietnam">
  <ul className="space-y-4">
    <li className="flex items-start gap-3">
      <img src="/icons/one.png" alt="Look Icon" className="w-6 h-6 mt-1" />
      <div>
        <strong>Look at the number.</strong><br />
        What could it signify?
      </div>
    </li>
    <li className="flex items-start gap-3">
      <img src="/icons/two.png" alt="Type Icon" className="w-6 h-6 mt-1" />
      <div>
        <strong>Make a guess. You have 4 in total.</strong><br />
        Type what you think the number relates to; e.g. 'keys on a piano', 'moon landing'.
      </div>
    </li>
    <li className="flex items-start gap-3">
      <img src="/icons/three.png" alt="Clue Icon" className="w-6 h-6 mt-1" />
      <div>
        <strong>Stuck? Reveal a clue!</strong><br />
        Remember though, this uses up a guess.
      </div>
    </li>
  </ul>

    </div>

  </DialogContent>
</div>
</Dialog>

<StatsModal
  open={showStats}
  onClose={() => setShowStats(false)}
  stats={stats}
  data={data}
  COLORS={COLORS}
  renderCenterLabel={renderCenterLabel}
  combinedLabel={combinedLabel}
/>
<AchievementsModal
  open={showAchievements}
  onClose={() => setShowAchievements(false)}
  earnedTiles={earnedTiles}
  categoryAchievements={{
    Maths: 8,
    Geography: 5,
    Science: 14,
    History: 3,
    Culture: 10,
    Sport: 12,
  }}
/>


<footer className="text-center text-sm text-gray-500 mt-10 pb-4">
  © {new Date().getFullYear()} B Puzzled. All rights reserved.
</footer>
</div> {/* CLOSE div properly here */}
</>
);
} // Close Home function

