"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart, Share2, HelpCircle, BookOpen, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";
import FunFactBox from "../components/FunFactBox";
import PostGameModal from "../components/PostGameModal";
import { shareResult } from "../utils/share";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { isCorrectGuess, isCloseGuess, isValidGuess, revealNextClue, updateStats } from "../utils/game";
import ComingSoon from "../components/ComingSoon";
import Link from "next/link";
import Header from "@/components/ui/header";
import useStats from "@/hooks/useStats";
import { track } from '@vercel/analytics';
import { fetchAllPuzzles, fetchTodayPuzzle } from "@/lib/api";
import Fuse from "fuse.js";
import Joyride from "react-joyride";
import StatsModal from "@/components/modals/StatsModal";
import FeedbackBox from "@/components/FeedbackBox";
import CommunityBox from "@/components/CommunityBox";
import { supabase } from "@/lib/supabase"; // or wherever your `supabase.js` file lives
import AchievementsModal from "@/components/AchievementsModal";
import WhatsNewModal from "@/components/modals/WhatsNewModal";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { getCookiePreferences } from "@/utils/cookies";
import { askLLMFallback } from '../lib/llm'; // adjust if needed
import { useRouter } from "next/router"; // 🔼 Place this at the top with other imports if not already there

// 🧪 Debug mode flag — uses environment variable
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

// 🐛 Controlled debug logger
function debugLog(...args) {
  if (!DEV_MODE) return; // ✅ Remove NODE_ENV check

  const forbiddenFields = [/*...*/];

  const hasSensitiveData = args.some(
    (arg) =>
      typeof arg === "object" &&
      arg !== null &&
      forbiddenFields.some((field) => field in arg)
  );

  if (hasSensitiveData) {
    console.warn("[DEBUG BLOCKED] Sensitive object detected, skipping log.");
    return;
  }

  console.log("[DEBUG]", ...args);
}

async function logCategoryReveal(puzzleId) {
  const deviceId = localStorage.getItem("deviceId") || "unknown";

  const { error } = await supabase.from("Player_responses").insert([
    {
      puzzle_id: puzzleId,
      device_id: deviceId,
      revealed_category: true,
      revealed_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("❌ Supabase error logging category reveal:", error);
  } else {
    console.log("📘 Category reveal logged to Supabase!");
  }
}

const fillerWords = [
  "a", "an", "the", "and", "or", "but", "if", "so", "because", "as", "although", "though", "while", "when", "where",
  "of", "in", "on", "at", "to", "from", "by", "with", "about", "into", "onto", "off", "over", "under", "through", "up", "down", "for",
  "is", "was", "were", "are", "am", "be", "been", "being", "do", "did", "does", "have", "has", "had",
  "will", "would", "shall", "should", "can", "could", "may", "might", "must",
  "that", "this", "these", "those", "such", "some", "any", "all", "each", "every", "no", "not", "only", "just",
  "how", "what", "which", "who", "whom", "whose", "why", "when", "where",
  "it", "its", "he", "she", "him", "her", "his", "they", "them", "their", "we", "us", "our", "you", "your", "i", "me", "my",
  "been", "being", "there", "here", "then", "than",
  "more", "less", "very", "too", "also", "again", "once", "even",
  "didn’t", "doesn’t", "wasn’t", "weren’t", "isn’t", "aren’t", "can’t", "won’t", "wouldn’t", "shouldn’t", "couldn’t",
  "yes", "no", "okay", "ok", "alright", 
];

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
  death: "assassination",
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
  shirt: "jersey",
  top: "jersey",
  vest: "jersey",
  shakespear: "shakespeare",
  shakespere: "shakespeare",
  shakspeare: "shakespeare",
  shakspear: "shakespeare",
  shackespeare: "shakespeare",
  shakesspeare: "shakespeare",
  shakspere: "shakespeare",
  shakesspear: "shakespeare",
  shakessper: "shakespeare",
  shakisper: "shakespeare",
  shaekspeare: "shakespeare",
  "shakesperes": "shakespeare",
  "shaksper": "shakespeare",
  "divine proportion": "golden ratio",
  "golden mean": "golden ratio",
  "golden section": "golden ratio",
  "phi ratio": "golden ratio",
  "beauty ratio": "golden ratio",
  "aesthetic ratio": "golden ratio",
  "golden number": "golden ratio",
  "golden constant": "golden ratio",
  "ideal proportion": "golden ratio",
  film: "movie",
  flick: "movie",
  "motion picture": "movie",
  launch: "release",
  premiere: "release",
  "star wars iv": "star wars",
  "new hope": "star wars",
  147: "maximum break",
  perfect: "maximum",
  score: "break",
  amount: "number",
  conflict: "war",
  battle: "war",
  hundred: "hundred years",
  100: "hundred",
  century: "hundred",
  britain: "england",
  english: "england",
  french: "france",
  us: "american",
  "the 13": "the thirteen",
  "13 colonies": "thirteen colonies",
  "original 13": "13 original",
  "united states": "america",
  states: "colonies",
  "fastest ever": "record",
  global: "world",
  "9.58 sec": "9.58 seconds",
  "100 metre": "100m",
  "100 meter": "100m",
  "fe": "iron",
  "element 26": "iron",
  "chess board": "chessboard",
  "squares": "tiles",
  "spaces": "tiles",
  "auto-ignition": "auto ignition",
  "autoignition": "auto-igntion",
  "ignition": "combust",
  "ignition": "flame point",
  "auto-ignition": "self-ignition",
  "auto-ignites": "self-ignites",
  "burn": "ignite",
  "burn": "combust",
  "catches fire": "burns",
  "needed": "required",
  "temp": "temperature",
  "ft": "feet",
};

function normalizeGuess(input = "") {
  return input
    .toLowerCase()
    .replace(/\b(\d+)\s*(m|km|kg|cm|s|ms|g|lb|lbs|ft|hz|nm|mm|mph|kph)\b/g, '$1$2') // join '100 m' → '100m'
    .replace(/[’']/g, '') // remove apostrophes
    .replace(/[^a-z0-9\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
}

function evaluateGuessKeywords(guess, { essential = [], required = [] }) {
  const normalizedGuess = normalizeGuess(guess);
  const guessTokens = new Set(normalizedGuess.split(/\W+/)); // ⚡ Faster lookup with Set!

  const normalizeAndFilter = (arr) =>
    arr.map(normalizeGuess).filter((token) => guessTokens.has(token));

  const matchedEssential = normalizeAndFilter(essential);
  const matchedRequired = normalizeAndFilter(required);

  return {
    matchCount: matchedEssential.length + matchedRequired.length,
    hasStrongMatch: matchedEssential.length > 0,
    hasWeakMatch: matchedRequired.length > 0,
    requiredMatched: matchedRequired.length > 0,
    matchedEssential,
    matchedRequired,
  };
}

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

function getPlayerTitle(stats) {
  const { gamesWon, guessDistribution } = stats;
  if (gamesWon === 0) return "Dabbler";

  const totalGuesses = Object.entries(guessDistribution)
    .filter(([key]) => key !== "failed")
    .reduce((sum, [key, value]) => sum + parseInt(key) * value, 0);

  const avgGuesses = totalGuesses / gamesWon;

  if (avgGuesses <= 1.5) return "Oracle";
  if (avgGuesses <= 2.2) return "Mage";
  if (avgGuesses <= 3.0) return "Scribe";
  return "Dabbler";
}

export default function Home({ overridePuzzle = null, isArchive: initialIsArchive = false, archiveIndex = null }) {

const [wasFirstTimePlayer, setWasFirstTimePlayer] = useState(false); // ✅

// ✨ JSX lifted out to constants
const guessStepContent = (
  <div>
    <p>
      Type what you think the number could relate to; e.g. <em>'keys on a piano'</em>, <em>'moon landing'</em> etc.
    </p>
    <p>
      <strong>You have 4 guesses to solve the puzzle... but, can you get it in one?</strong>
    </p>
  </div>
);

const clueStepContent = (
  <p>
    Need help? Reveal a clue! Remember though, each time you do, this uses up a guess.
  </p>
);

const achievementsStepContent = (
  <p>
    Tap the trophy icon to view your achievements — including category progress and tiles earned!
  </p>
);

const statsStepContent = (
  <p>
    Track your daily streaks and puzzle stats here.
  </p>
);

// ✅ Safe for production build
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
    content: guessStepContent,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".reveal-button",
    content: clueStepContent,
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".achievements-button",
    content: achievementsStepContent,
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".stats-button",
    content: statsStepContent,
    disableBeacon: true,
    disableScrolling: true,
    wait: 500,
  },
  {
    target: ".token-counter",
    content: "Finally, these are your tokens. Use them to reveal the category for tricky puzzles. You start with 3 and can earn more!",
    placement: "bottom",
    disableBeacon: true,
    wait: 500,
  },
];

    
  const { stats, setStats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();
    const incorrectGuessMessages = [
    "Incorrect - here's a clue to help you!",
    "Hmm, not quite. Keep thinking!",
    "Last clue! Take a deep breath and go for it.",
  ];
  
  const [pendingWhatsNew, setPendingWhatsNew] = useState(false);
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
  const [earnedTileIndexes, setEarnedTileIndexes] = useState([]);
    
const [hasMounted, setHasMounted] = useState(false);
const [allPuzzles, setAllPuzzles] = useState([]);

const [puzzle, setPuzzle] = useState(null);
const router = useRouter();
const [routerReady, setRouterReady] = useState(false);

useEffect(() => {
  if (router.isReady) setRouterReady(true);
}, [router.isReady]);

const queryArchiveId = router?.query?.archive;
const isArchive = initialIsArchive || !!queryArchiveId;

useEffect(() => {
  if (puzzle && isArchive) {
    console.log("🧩 Archive puzzle loaded:", {
      number: puzzle.number,
      formatted: puzzle.formatted,
      revealFormattedAt: puzzle.revealFormattedAt,
      answer: puzzle.answer,
    });
  }
}, [puzzle, isArchive]);

useEffect(() => {
  if (!puzzle) return;

  const saved = localStorage.getItem(`gameState-${puzzle.date}`);
  if (!saved) return;

  try {
    const { attempts: savedAttempts, revealedClues: savedClues, isCorrect: savedIsCorrect, guess: savedGuess } = JSON.parse(saved);
    setAttempts(savedAttempts || 0);
    setRevealedClues(savedClues || []);
    setIsCorrect(savedIsCorrect || false);
    setGuess(savedGuess || "");
    console.log("🔁 Restored saved game state.");
  } catch (err) {
    console.warn("⚠️ Failed to parse saved game state:", err);
  }
}, [puzzle]);

const [puzzleNumber, setPuzzleNumber] = useState(null);

const [localDate, setLocalDate] = useState("");
const [showWhatsNew, setShowWhatsNew] = useState(false);

const COMMUNITY_PUZZLES = {
  "2025-06-02": { name: "Holiday", city: "Ohio", country: "USA", flag: "USA" },
};

const contributor = COMMUNITY_PUZZLES[puzzle?.date];
const isCommunityPuzzle = !!contributor;
  
const [showTour, setShowTour] = useState(false);
const [stepIndex, setStepIndex] = useState(0);
const [tourKey, setTourKey] = useState(Date.now()); // forces  reset if needed
const [readyToRunTour, setReadyToRunTour] = useState(false);

const TILE_WORD = "NUMERUS";
const [showTokenBubble, setShowTokenBubble] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  const hasGivenStarterTokens = localStorage.getItem("starterTokensGiven");
  let currentTokens = parseInt(localStorage.getItem("freeToken") || "0", 10);

  if (!hasGivenStarterTokens) {
    currentTokens += 3;
    localStorage.setItem("freeToken", currentTokens.toString());
    localStorage.setItem("starterTokensGiven", "true");
    console.log("🟢 Starter tokens granted!");
    setShowTokenBubble(true);
    setTimeout(() => setShowTokenBubble(false), 3000);
  }

  setTokenCount(currentTokens);
}, []);


useEffect(() => {
  const hasSeenTour = localStorage.getItem("seenTour") === "true";

  if (!puzzle || !hasMounted) return;

if (!hasSeenTour) {
 setWasFirstTimePlayer(true); // ✅ tracked in state now

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

    setTimeout(tryStartTour, 300);
  } else {
    const hasSeenWhatsNew = localStorage.getItem("seenWhatsNew") === "true";
    if (!hasSeenWhatsNew) {
      setShowWhatsNew(true);
      localStorage.setItem("seenWhatsNew", "true");
    }
  }
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
  if (isArchive && puzzle?.id) {
    const archiveToken = localStorage.getItem("archiveToken");
    const played = JSON.parse(localStorage.getItem("playedArchive") || "[]");
    const alreadyPlayed = played.includes(puzzle.id);

    if (!archiveToken || alreadyPlayed) {
      console.warn("🚫 Archive access blocked — invalid token or puzzle already played.");
      window.location.href = "/";
    } else {
      localStorage.setItem("playedArchive", JSON.stringify([...played, puzzle.id]));
      console.log("✅ Archive token accepted and puzzle allowed.");
    }
  }
}, [isArchive, puzzle]);

const [canPlayBonus, setCanPlayBonus] = useState(false);


useEffect(() => {
  const resetAt = parseInt(localStorage.getItem("resetTilesAt") || "0", 10);
  const now = Date.now();

  if (resetAt && now > resetAt) {
    localStorage.removeItem("earnedTileIndexes");
    localStorage.removeItem("resetTilesAt");
    console.log("🧼 Cleared earnedTileIndexes for a new cycle.");
  }
}, []);

useEffect(() => {
  if (pendingWhatsNew) {
    const delay = setTimeout(() => {
      setShowWhatsNew(true);
      localStorage.setItem("seenWhatsNew", "true");
      setPendingWhatsNew(false); // reset
    }, 500); // slight delay
    return () => clearTimeout(delay); // clean up on unmount
  }
}, [pendingWhatsNew]);

    
useEffect(() => {
  const existingId = localStorage.getItem("device_id");
  if (!existingId) {
    const newId = crypto.randomUUID();
    localStorage.setItem("device_id", newId);
  }
}, []);

useEffect(() => {
  localStorage.removeItem("earnedTiles");
}, []);
  
useEffect(() => {
  console.log("✅ DEV_MODE from env:", process.env.NEXT_PUBLIC_DEV_MODE);
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
  if (isArchive && puzzle?.id) {
    const played = JSON.parse(localStorage.getItem("playedArchive") || "[]");
    if (!played.includes(puzzle.id)) {
      localStorage.setItem("playedArchive", JSON.stringify([...played, puzzle.id]));
    }
  }
}, [isArchive, puzzle]);

useEffect(() => {
  if (!routerReady) return;

  async function loadPuzzles() {
    const all = await fetchAllPuzzles();
    setAllPuzzles(all);
    localStorage.setItem("allPuzzles", JSON.stringify(all));

    let selected = null;

    console.log("📦 [loadPuzzles] overridePuzzle:", overridePuzzle);
    console.log("📦 [loadPuzzles] isArchive:", isArchive);
    console.log("📦 [loadPuzzles] queryArchiveId:", queryArchiveId);


if (isArchive && overridePuzzle) {
  selected = overridePuzzle;
} else if (isArchive && queryArchiveId) {
  const archivePuzzleNumber = parseInt(queryArchiveId, 10);
  selected = all.find(p => p.puzzle_number === archivePuzzleNumber);
  if (!selected) {
    console.warn("🚫 Archive puzzle not found by puzzle_number:", archivePuzzleNumber);
  }
} else {
  const today = await fetchTodayPuzzle();
  if (today) {
    debugLog("✅ Today's puzzle loaded.");
    selected = today;
  } else {
    console.warn("⚠️ No puzzle returned for today.");
  }
}

    if (selected) {
      setPuzzle(selected);
      setPuzzleNumber(selected.puzzle_number ?? selected.id);

      // ✅ Completion tracking
      let completed = JSON.parse(localStorage.getItem("completedPuzzles") || "null");
      let isNewPlayer = false;

      if (!Array.isArray(completed)) {
        completed = [];
        all.forEach((p) => {
          if (localStorage.getItem(`completed-${p.date}`) === "true") {
            completed.push(p.id);
          }
        });
        localStorage.setItem("completedPuzzles", JSON.stringify(completed));
        isNewPlayer = completed.length === 0;

        console.log(
          completed.length > 0
            ? "✅ Migrated old completions to completedPuzzles."
            : "🆕 No old completions found. Initialized empty completedPuzzles."
        );
      } else {
        isNewPlayer = completed.length === 0;
      }

      setCompletedPuzzles(completed);
    }
  }

  loadPuzzles();
}, [routerReady, selectedPuzzleIndex, isArchive, overridePuzzle, queryArchiveId]);

useEffect(() => {
  if (puzzle && puzzle.puzzle_number) {
    const savedState = localStorage.getItem(`puzzleState-${puzzle.puzzle_number}`);
    if (savedState) {
      const { guesses: savedGuesses, cluesRevealed: savedClues } = JSON.parse(savedState);
      if (Array.isArray(savedGuesses)) setGuesses(savedGuesses);
      if (Array.isArray(savedClues)) setCluesRevealed(savedClues);
    }
  }
}, [puzzle]);

useEffect(() => {
  if (puzzle && puzzle.puzzle_number) {
    const state = {
      guesses,
      cluesRevealed,
    };
    localStorage.setItem(`puzzleState-${puzzle.puzzle_number}`, JSON.stringify(state));
  }
}, [guesses, cluesRevealed, puzzle]);


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
  if (!isCorrect || isArchive) return;

  const granted = localStorage.getItem("firstTokenGranted") === "true";
  if (granted) {
    setCanPlayBonus(true);
  }
}, [isCorrect, isArchive]);

// ✅ NEW: Mark archive puzzle as completed
useEffect(() => {
  if (!gameOver || !isCorrect || isArchive !== true) return;

  const tokenUsed = localStorage.getItem("archiveTokenUsed") === "true";
  if (tokenUsed) {
    localStorage.setItem("justCompletedArchive", "true");
    localStorage.removeItem("archiveTokenUsed"); // clean it up
  }

  const completed = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");
  if (!completed.includes(puzzle.id)) {
    localStorage.setItem("completedPuzzles", JSON.stringify([...completed, puzzle.id]));
  }
}, [gameOver, isCorrect, isArchive]);

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

function getYesterdayUK() {
  const now = new Date();
  const ukNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
  ukNow.setDate(ukNow.getDate() - 1);
  return ukNow.toLocaleDateString("en-GB");
}

function awardTile() {
  const today = new Date().toLocaleDateString("en-GB", { timeZone: "Europe/London" });
  const lastPlayDate = localStorage.getItem("lastPlayDate");

  if (lastPlayDate && lastPlayDate !== getYesterdayUK()) {
    localStorage.removeItem("earnedTileIndexes");
    console.log("🔁 Streak broken — resetting earned tiles.");
  }

  localStorage.setItem("lastPlayDate", today);

  const storedIndexes = JSON.parse(localStorage.getItem("earnedTileIndexes") || "[]");

  if (storedIndexes.length >= TILE_WORD.length) return;

  const puzzleDate = puzzle?.date;
  if (!puzzleDate || localStorage.getItem(`tile-earned-${puzzleDate}`) === "true") return;

  const nextIndex = storedIndexes.length; // 0 → N, 1 → U, etc.
  const newIndexes = [...storedIndexes, nextIndex];

  // ✅ Save only earnedTileIndexes — not earnedTiles as letters
  localStorage.setItem("earnedTileIndexes", JSON.stringify(newIndexes));
  localStorage.setItem(`tile-earned-${puzzleDate}`, "true");
  setEarnedTileIndexes(newIndexes);

  // ✅ Optional: if all tiles collected, give a token reward
  if (newIndexes.length === TILE_WORD.length) {
    const currentTokens = parseInt(localStorage.getItem("freeToken") || "0", 10);
    localStorage.setItem("freeToken", (currentTokens + 1).toString());
    setTokenCount(currentTokens + 3);
    setJustEarnedToken(true);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    localStorage.setItem("resetTilesAt", tomorrow.getTime().toString());
  }
}

function isNewPlayer() {
  const completed = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");
  return completed.length === 0;
}

const handleGuess = async (isClueReveal = false) => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  const cleanedGuess = normalizeGuess(guess);
  const puzzleId = puzzle?.id ?? 0;

const normalizedGuessForConflicts = normalizeGuess(cleanedGuess);

// 👇 NEW: puzzle-specific thresholds for minimum guess quality
const minGuessWords = puzzle.min_guess_words ?? 1;
const minEssentialKeywords = puzzle.min_essential_keywords ?? 1;

const categoryConflicts = {
  sports: ["women", "female", "girls"],
  // Add others as needed
};

const conflictWords =
  puzzle.conflicts?.length > 0
    ? puzzle.conflicts
    : categoryConflicts[puzzle.category?.toLowerCase()] || [];

const normalizedConflicts = conflictWords.map(w =>
  w.toLowerCase().replace(/[’']/g, "").replace(/\bs\b/, "").replace(/\b(women|female|girl)s?\b/g, "$1")
);

const hasConflict = normalizedConflicts.some(word =>
  new RegExp(`\\b${word}\\b`, "i").test(normalizedGuessForConflicts)
);

debugLog("🛑 Normalized guess for conflicts:", normalizedGuessForConflicts);
debugLog("🚫 Final matched conflicts:", normalizedConflicts.filter(w =>
  new RegExp(`\\b${w}\\b`, "i").test(normalizedGuessForConflicts)
));


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

  const handleGameOver = (newAttempts) => {
  setStats((prev) => updateStats(prev, false));

  if (typeof track === "function" && getCookiePreferences().analytics) {
    track("puzzle_failed", { correct: false, attempts: newAttempts, puzzleId });
    track("puzzle_guess_count", { guessCount: "✖", puzzleId });
  }

  setTimeout(() => setShowPostGame(true), 500);
};

  debugLog("Matched Essential:", matchedEssential);
  debugLog("Essential Keywords:", puzzle.essential_keywords);
  debugLog("Normalized Guess:", cleanedGuess);

  debugLog("Matched Essential:", matchedEssential, "from:", cleanedGuess);
  debugLog("Essential keywords:", puzzle.essential_keywords);

if (!isClueReveal && !cleanedGuess) {
  setInputError("Please enter a guess before submitting.");
  setIsSubmitting(false); // 🛠 Unlock submit if blank
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
  { label: normalizeGuess(puzzle.answer) },
  ...(puzzle.acceptableGuesses || puzzle.acceptable_guesses || []).map((g) => ({
    label: normalizeGuess(g),
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

    const bestMatchLabel = bestMatch?.item?.label ?? "";
    const normalizedBestMatch = normalizeGuess(bestMatchLabel);
    const essentialInBestMatch = puzzle.essential_keywords.filter((kw) =>
     normalizedBestMatch.includes(normalizeGuess(kw))
    );

    const essentialCoverage = essentialInBestMatch.length / (puzzle.essential_keywords.length || 1);

    
const normalizedGuess = cleanedGuess.replace(/\s+/g, '');

const allNormalizedAcceptable = (puzzle.acceptableGuesses || puzzle.acceptable_guesses || []).map(normalizeGuess);

const acceptableStrings = allNormalizedAcceptable.filter(g => g.split(" ").length >= 2);
const singleWordAcceptables = new Set(allNormalizedAcceptable.filter(g => g.split(" ").length === 1));

const exactAcceptableMatch = acceptableStrings.some(
  g => normalizeGuess(g).replace(/\s+/g, '') === normalizedGuess
) || singleWordAcceptables.has(cleanedGuess);


// 🐛 Debug log for inspection
debugLog("🔍 Acceptable normalized strings:", acceptableStrings);


const isExactAnswerMatch = normalizeGuess(puzzle.answer) === cleanedGuess;

const acceptableFuse = new Fuse(
  acceptableStrings.map(label => ({ label })),
  {
    keys: ["label"],
    threshold: 0.55, // slightly relaxed
    distance: 100,
    includeScore: true,
    ignoreLocation: true,
  }
);

const acceptableResults = acceptableFuse.search(cleanedGuess);

const bestAcceptable = acceptableResults[0];
const topScore = bestAcceptable?.score ?? null;
const guessWordCount = cleanedGuess.trim().split(/\s+/).length;

const uniqueEssentialMatchCount = new Set(matchedEssential).size;
const strongEssentialHit = uniqueEssentialMatchCount >= 2;
    
const isMeaningfulGuess =
  guessWordCount >= 2 ||
  (
    cleanedGuess.length >= 12 &&
    (strongEssentialHit || requiredMatched)
  );
    
const failsKeywordMinimum = matchedEssential.length === 0 && matchedRequired.length === 0;

debugLog("🚫 failsKeywordMinimum check:", {
  matchedEssential,
  matchedRequired,
  failsKeywordMinimum
});

// ❗️NEW: Block vague guesses like "temperature" or "fire" based on puzzle criteria
const failsMinimumContent =
  guessWordCount < minGuessWords ||
  matchedEssential.length < minEssentialKeywords;

// ✅ Now it's safe to log
debugLog("🧠 Content quality checks", {
  isMeaningfulGuess,
  strongEssentialHit,
  requiredMatched,
  topScore,
  failsMinimumContent,
  failsKeywordMinimum,
});
    
// 🚫 Only allow 1-word guesses if VERY strong essential + required match
const isAcceptableGuess =
  topScore !== null &&
  topScore <= 0.45 &&
  !failsKeywordMinimum &&
  !failsMinimumContent && // 👈 NEW safeguard
  (
    isMeaningfulGuess ||
    (strongEssentialHit && requiredMatched && topScore <= 0.1)
  );

// ✨ Allow typo forgiveness for single-word guesses if very close match
const typoForgivenessGuess =
  !isAcceptableGuess &&
  guessWordCount === 1 &&
  !failsMinimumContent && // 👈 NEW
  bestMatch?.score !== undefined &&
  bestMatch.score <= 0.15 &&
  allAnswers.some(({ label }) => label === bestMatch.item.label);


// override if typo forgiveness applies
if (typoForgivenessGuess) {
  debugLog("✅ Typo forgiveness applied:", {
    cleanedGuess,
    topScore,
    topLabel: bestAcceptable?.item?.label,
  });
}


debugLog("🧠 Acceptable guess check:", {
  cleanedGuess,
  guessWordCount,
  topScore,
  topLabel: bestAcceptable?.item?.label,
  isAcceptableGuess,
  acceptableStrings,
  allAcceptableResults: acceptableResults.map(r => ({
    label: r.item.label,
    score: r.score,
  })),
});

    
// Calculate keyword coverage ratios
const essentialTotal = puzzle.essential_keywords.length || 1;
const requiredTotal = (puzzle.keywords?.length || 1);

const essentialCoverageRatio = matchedEssential.length / essentialTotal;
const requiredCoverageRatio = matchedRequired.length / requiredTotal;

const nearMissEssential = uniqueEssentialMatchCount === 1;
const hasOnlyEssentialMatch = hasStrongMatch && uniqueEssentialMatchCount >= 2;

// Relaxed fallback rule using coverage ratios
const relaxedRule =
  essentialCoverageRatio >= 0.25 &&
  requiredCoverageRatio >= 0.25 && // ← previously 0.5
  guessWordCount >= 3 &&           // ← use word count instead of char length
  (bestMatch?.score ?? 1) <= 0.7;

debugLog("🧪 Relaxed Rule Check", {
  essentialCoverageRatio,
  requiredCoverageRatio,
  guessWordCount,
  fuzzyScore: bestMatch?.score ?? null,
  relaxedRule
});

let raw = null; // 👈 Hoist raw
let hasTooLittleEvidence = false; // 👈 Hoist this too


// ✅ Final match logic
let matchType = "none"; // allow override by LLM later

let isCorrectGuess = (
  (typoForgivenessGuess && !hasConflict) ||
  (
    !hasConflict &&
    (
      isExactAnswerMatch ||
      exactAcceptableMatch ||
      isAcceptableGuess ||
      (
        bestMatch?.score <= 0.65 &&
        hasStrongMatch &&
        requiredMatched &&
        strongEssentialHit
      ) ||
      relaxedRule
    )
  )
);

    
debugLog("🧪 LLM Fallback Gate", {
  isCorrectGuess,
  guessWordCount,
  cleanedGuessLength: cleanedGuess.length,
});

// 🧠 If initial checks failed, evaluate LLM fallback — but block weak guesses
const hasNoMatchEvidence = !isExactAnswerMatch &&
  !exactAcceptableMatch &&
  !isAcceptableGuess &&
  !relaxedRule &&
  (!bestMatch || bestMatch.score > 0.65) &&
  matchedEssential.length === 0 &&
  matchedRequired.length === 0;

// 🛡 Block LLM fallback if the guess has known conflicting terms
if (hasConflict) {
  debugLog("🚫 LLM fallback blocked due to conflict match:", conflictWords);
} else if (hasNoMatchEvidence) {
  debugLog("🚫 LLM fallback blocked: no sufficient matching evidence");
} else if (!isCorrectGuess && (guessWordCount >= 3 || cleanedGuess.length >= 8)) {
  const result = await askLLMFallback({ guess, puzzle });
  raw = result.raw;

const vaguePlaceholders = ["something", "someone", "somewhere", "thing", "stuff"];
const containsVaguePlaceholder = vaguePlaceholders.some(p =>
  new RegExp(`\\b${p}\\b`, "i").test(cleanedGuess)
);

const minimalEvidence =
  matchedEssential.length < minEssentialKeywords ||
  guessWordCount < minGuessWords;


const lacksDirectReference = !normalizeGuess(puzzle.answer)
  .split(" ")
  .some(part => normalizeGuess(cleanedGuess).includes(part));

const mathLikeGuess = /\b\d+\s*(squared|cubed|[\+\-\*\/^])\b/i.test(cleanedGuess);

hasTooLittleEvidence =
  containsVaguePlaceholder ||
  mathLikeGuess ||
  matchedEssential.length < minEssentialKeywords ||
  guessWordCount < minGuessWords;


  if (result.accept && hasTooLittleEvidence) {
    debugLog("🚫 LLM accepted vague guess — rejected via safeguard");
  } else if (result.accept) {
    isCorrectGuess = true;
    matchType = "llm_accept";
    debugLog("🧠 LLM accepted fallback:", raw);
  } else {
    debugLog("🧠 LLM rejected fallback:", raw);
  }
}

// 🧠 Track why it passed or failed (only if not set by LLM)
if (matchType === "none") {
  matchType = isExactAnswerMatch
    ? "exact_answer"
    : exactAcceptableMatch
    ? "exact_acceptable"
    : isAcceptableGuess
    ? "fuzzy_acceptable"
    : (
        bestMatch?.score <= 0.65 &&
        hasStrongMatch &&
        requiredMatched &&
        strongEssentialHit
      )
    ? "fuzzy_with_required"
    : relaxedRule
    ? "relaxed_rule"
    : typoForgivenessGuess
    ? "fuzzy_typo"
    : "none";
}


// ✅ Log the guess to Supabase with error handling
const { error } = await supabase.from("Player_responses").insert([
  {
    puzzle_id: puzzleId.toString(),
    raw_guess: guess,
    cleaned_guess: cleanedGuess,
    is_correct: isCorrectGuess,
    match_type: matchType,
    attempt: attempts + 1,
    device_id: localStorage.getItem("device_id") || "unknown",
    llmUsed: matchType === "llm_accept",
    llmRaw: matchType === "llm_accept" ? raw : null,
    notes: JSON.stringify({
      essentialHit: [...new Set(matchedEssential)],
      requiredHit: [...new Set(matchedRequired)],
      fuzzyScore: bestMatch?.score ?? null,
      matchedAnswer: bestMatch?.item?.label ?? null,
      relaxedRule,
      guessWordCount,
      conflictDetected: hasConflict
        ? conflictWords.filter(w =>
            new RegExp(`\\b${w}\\b`, "i").test(normalizedGuessForConflicts)
          )
        : [],
      relaxedRuleDetails: relaxedRule
        ? {
            hasOnlyEssentialMatch,
            cleanedGuessLength: cleanedGuess.length,
            matchedRequiredCount: matchedRequired.length,
            fuzzyScore: bestMatch?.score ?? null,
            bestMatchLabel: bestMatchLabel,
            essentialCoverage,
            essentialInBestMatch,
            essentialCoverageRatio,
            requiredCoverageRatio,
          }
        : null,
      acceptedByLabel: acceptableResults[0]?.item?.label ?? null,
      llmReason:
        matchType === "llm_accept"
          ? hasTooLittleEvidence
            ? "blocked-vague"
            : "accepted"
          : "not_used",
    }),
  },
]);



if (error) {
  console.error("❌ Supabase insert error:", error);
} else {
  console.log("✅ Guess successfully logged to Supabase!");
}


    if (isCorrectGuess) {
      setIsCorrect(true);
      localStorage.setItem(`completed-${puzzle.date}`, "true");
      const existingCompleted = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");
      if (!existingCompleted.includes(puzzle.id)) {
       existingCompleted.push(puzzle.id);
       localStorage.setItem("completedPuzzles", JSON.stringify(existingCompleted));
   }

      // 🎁 Archive token reward — only for new players, first correct puzzle
     const alreadyGranted = localStorage.getItem("archiveToken");
     if (!alreadyGranted && existingCompleted.length === 1) {
     const today = new Date().toISOString().split("T")[0];
     localStorage.setItem("archiveToken", today);
     console.log("🎁 Archive token granted after first win!");
    }

      setStats((prev) => updateStats(prev, true, attempts + 1));
      setGuess("");

      if (typeof track === "function" && getCookiePreferences().analytics) {
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
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

const clueIndex = revealedClues.length;
const nextClue = puzzle.clues?.[clueIndex];

if (nextClue && !revealedClues.includes(nextClue)) {
  setRevealedClues([...revealedClues, nextClue]);
}

      setInputError(
        nearMissEssential
          ? "You're close — try adding a more specific word!"
          : "You're on the right track!"
      );

      if (newAttempts >= maxGuesses) {
        awardTile(); // ✅ Only shown in first path
        handleGameOver(newAttempts); // 👈 Wrapped tracking + stats
      }

    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const clueIndex = revealedClues.length;
      const nextClue = puzzle.clues?.[clueIndex];

      if (nextClue && !revealedClues.includes(nextClue)) {
        setRevealedClues([...revealedClues, nextClue]);
      }

      if (newAttempts >= maxGuesses) {
        handleGameOver(newAttempts); // 👈 Same logic reused here too
      } else {
        setInputError("Hmm, not quite. Try again or reveal a clue!");
      }

      setGuess(""); // ✅ Leave outside the if/else
    }
  } catch (error) {
    console.error("❌ Error in handleGuess:", error);
    setInputError("Something went wrong. Try again!");
  } finally {
    setIsSubmitting(false);
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

  const clueIndex = revealedClues.length;
  const nextClue = puzzle.clues?.[clueIndex];

  if (nextClue && !revealedClues.includes(nextClue)) {
    setRevealedClues([...revealedClues, nextClue]);
    setAttempts((prev) => prev + 1); // Don't forget to increment attempts!
  }

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

    // ✅ Track usage in Supabase
    logCategoryReveal(puzzle.id);

  }, 1000);
};

const shareTextHandler = () => {
  shareResult({
    isCorrect,
    guessCount: attempts + 1,
    puzzleNumber,
  });

  if (typeof track === "function" && getCookiePreferences().analytics) {
    track("share_clicked", {
      correct: isCorrect,
      attempts,
      puzzleId: puzzle?.id ?? null,
    });
  }
}; // ✅ <-- This closing brace was missing!

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

  // When the tour ends (finished or skipped)
  if (data.status === "finished" || data.status === "skipped") {
    setShowTour(false);
    localStorage.setItem("seenTour", "true");

    // ✅ Trigger What's New only if this is the first-time player
const hasSeenWhatsNew = localStorage.getItem("seenWhatsNew") === "true";
if (wasFirstTimePlayer && !hasSeenWhatsNew) {
  setPendingWhatsNew(true); // 🔁 Let useEffect handle it
}

    return;
  }

  // Advance steps
  if (data.type === "step:after") {
    const nextStep = stepIndex + 1;
    const nextTargetSelector = joyrideSteps[nextStep]?.target;

    if (!nextTargetSelector) {
      debugLog("✅ All Joyride steps complete!");
      setShowTour(false);
      localStorage.setItem("seenTour", "true");
      return;
    }

    const nextTarget = document.querySelector(nextTargetSelector);
    if (nextTarget) {
      setStepIndex(nextStep);
    } else {
      setTimeout(() => {
        const retryTarget = document.querySelector(nextTargetSelector);
        if (retryTarget) {
          debugLog(`✅ Retry succeeded: advancing to step ${nextStep}`);
          setStepIndex(nextStep);
        } else {
          console.warn(`❌ Still missing Joyride step target after retry: ${nextTargetSelector}`);
          setShowTour(false);
        }
      }, 500);
    }
  }

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

{isArchive && (
  <p className="text-sm text-gray-500 text-center italic">
    One from the Archives...
  </p>
)}

{isCommunityPuzzle ? (
  <div className="flex flex-col items-center space-y-1 mb-3">
    {/* Logo Line */}
    <div className="flex items-center justify-center space-x-2">
      <span className="text-base text-gray-800 font-medium">A</span>
      <img
        src="/icons/logo-numerus-community.png"
        alt="NumerUS Community"
        className="h-10 sm:h-11 object-contain"
      />
      <span className="text-base text-gray-800 font-medium">puzzle</span>
    </div>

    {/* Yellow Box */}
    <div className="shimmer-box text-center text-lg sm:text-xl max-w-md px-4 py-2 rounded shadow-sm bg-yellow-100 border border-yellow-300">
      Today’s number comes from <strong>{contributor.name} in {contributor.city}, {contributor.country}</strong>.
    </div>
  </div>
) : (
  <h1 className="text-2xl font-bold mt-4">
    {isArchive ? "This puzzle's number was:" : "Today's number is:"}
  </h1>
)}


<Card className="w-full max-w-md p-1 text-center border-2 border-[#3B82F6] bg-white shadow-lg relative">
  <CardContent className="relative">


    {/* 🟡 Token Counter INSIDE Card */}
    <div className="absolute top-2 right-2 z-10 md:z-10 lg:z-10 token-counter">
     <div className={`bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md
      ${justEarnedToken ? "token-pop token-glow" : ""} 
      ${spendingToken ? "animate-token-spin" : ""}
     `}>
    {tokenCount}
  </div>
      {showTokenBubble && (
  <div className="absolute -top-6 right-0 bg-white border border-green-400 text-green-600 px-2 py-1 text-xs rounded shadow">
    +3 free tokens!
  </div>
)}

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
  isArchive={isArchive}
  canPlayBonus={canPlayBonus}
/>
   
           
{(() => {
  const hasFormatted = typeof puzzle.formatted === "string";

  // Use puzzle.revealFormattedAt if it's a number; otherwise default to clue 3
  const revealAt =
    typeof puzzle.revealFormattedAt === "number"
      ? puzzle.revealFormattedAt
      : (hasFormatted ? 3 : Infinity);

  const shouldRevealFormatted =
    hasFormatted && (isCorrect || revealedClues.length >= revealAt);

  return (
    <p className="text-4xl font-bold text-[#3B82F6] font-daysone daily-number">
      {shouldRevealFormatted ? puzzle.formatted : puzzle.number}
    </p>
  );
})()}

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
  onChange={(e) => {
    setGuess(e.target.value);
    if (inputError) setInputError(""); // 🧽 Clear error on typing
  }}
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

    {!isArchive && (
      <>
        <p className="font-semibold text-gray-800 mt-2">
          Come back tomorrow for your next workout!
        </p>
        <p className="text-sm text-gray-500">
          Next puzzle in: {countdown}
        </p>
      </>
    )}

    <CommunityBox />

    {isArchive && (
      <div className="flex flex-col items-center space-y-2 mt-4">
        <button
          onClick={() => window.location.href = "/archives"}
          className="px-4 py-2 rounded text-white font-semibold transition shadow hover:opacity-90 w-48"
          style={{ backgroundColor: "#b49137" }}
        >
          Back to Archive
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 rounded text-white font-semibold transition shadow hover:opacity-90 w-48"
          style={{ backgroundColor: "#63c4a7" }}
        >
          Back to Daily Puzzle
        </button>
      </div>
    )}
  </div>
)}
  </CardContent>
</Card>

<div className="flex flex-col items-center mt-4">
  <p className="text-lg font-semibold">
    {isArchive && puzzle?.date
      ? new Date(puzzle.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : localDate}
  </p>
  <p className="text-md font-medium">
    Numerus #{isArchive ? archiveIndex : puzzleNumber}
  </p>
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
</div> {/* <-- This closes the <Dialog> content wrapper */}
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
/>


<CookieConsentBanner />

<footer className="text-center text-sm text-gray-500 mt-10 pb-4">
  © {new Date().getFullYear()} B Puzzled. All rights reserved.
</footer>
</div> {/* CLOSE div properly here */}
</>
);
} // Close Home function
