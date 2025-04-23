"use client";

import OnScreenKeyboard from "../components/OnScreenKeyboard";
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

// 🔁 Synonym replacement map for flexible matching
const synonymMap = {
  quickest: "fastest",
  rapid: "fast",
  speedy: "fast",
  rubix: "rubik",
  rubicks: "rubik",
  "rubik's": "rubik",
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
};

const normalize = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // strip punctuation
    .split(" ")
    .map((word) => synonymMap[word] || word)
    .join(" ")
    .trim();

const DEV_MODE = false;

const colorClassMap = {
  blue: "text-blue-700 bg-blue-100 hover:bg-blue-200",
  green: "text-green-700 bg-green-100 hover:bg-green-200",
  maroon: "text-red-900 bg-red-100 hover:bg-red-200",
  yellow: "text-yellow-700 bg-yellow-100 hover:bg-yellow-200",
  purple: "text-purple-700 bg-purple-100 hover:bg-purple-200",
  red: "text-red-700 bg-red-100 hover:bg-red-200",
};

  export default function Home() {

const joyrideSteps = [
  {
    target: ".daily-number",
    content: "Welcome to Numerus - the daily reverse trivia game. This is today's number. Can you figure out what it represents?",
    disableBeacon: true,
  },
  {
    target: ".guess-input",
    content: (
      <div>
        <p>
          Type what you think the number could relate to, e.g. <em>'keys on a piano'</em>, <em>'moon landing'</em> etc.
        </p>
        <p>
          <strong>You have 4 guesses to solve the puzzle.</strong>
        </p>
      </div>
    ),
  },
  {
    target: ".reveal-button",
    content: "Need help? Reveal a clue! Remember though, this counts as one of your 4 guesses.",
    disableBeacon: true,
  },
  {
    target: ".stats-button",
    content: "Track your daily streaks and puzzle stats here.",
    disableBeacon: true,
  },
];
    
  const { stats, setStats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();
    const incorrectGuessMessages = [
    "Incorrect - here's a clue to help you!",
    "Hmm, not quite. Keep thinking!",
    "Last clue! Take a deep breath and go for it.",
  ];
    
  const [openTooltip, setOpenTooltip] = useState(null);
  const [dateString, setDateString] = useState("");
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [revealedClues, setRevealedClues] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [inputError, setInputError] = useState("");
  const tooltipRefs = useRef([]);
  const [showPostGame, setShowPostGame] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(null);
  const [revealDisabled, setRevealDisabled] = useState(false);

const [hasMounted, setHasMounted] = useState(false);
const [allPuzzles, setAllPuzzles] = useState([]);
const [puzzle, setPuzzle] = useState(null);
const [puzzleNumber, setPuzzleNumber] = useState(null);

const [localDate, setLocalDate] = useState("");

const [showTour, setShowTour] = useState(false);
const [stepIndex, setStepIndex] = useState(0);
const [tourKey, setTourKey] = useState(Date.now()); // forces  reset if needed
const [readyToRunTour, setReadyToRunTour] = useState(false);

useEffect(() => {
  const seenTour = localStorage.getItem("seenTour");
  if (seenTour) return;

  const observer = new MutationObserver(() => {
    const daily = document.querySelector(".daily-number");
    const input = document.querySelector(".guess-input");
    const clue = document.querySelector(".reveal-button");
    const stats = document.querySelector(".stats-button");

    console.log("📌 Target check:", {
      daily: !!daily,
      input: !!input,
      clue: !!clue,
      stats: !!stats,
    });

if (daily && input && clue && stats) {
  observer.disconnect();
  console.log("✅ All Joyride elements found. Delaying tour start...");

  // Delay start slightly to avoid race condition
  setTimeout(() => {
    setReadyToRunTour(true);
    setStepIndex(0);
    setTourKey(Date.now());
    setShowTour(true);
  }, 100); // 👈 delay by 100ms
}

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);



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
  const loadPuzzles = async () => {
    const all = await fetchAllPuzzles();
    setAllPuzzles(all);

    if (DEV_MODE && selectedPuzzleIndex !== null) {
      const devPuzzle = all[selectedPuzzleIndex];
      setPuzzle(devPuzzle);
      setPuzzleNumber(selectedPuzzleIndex + 1);
    } else {
const today = await fetchTodayPuzzle();
if (today) {
  setPuzzle(today);

  // Optionally find the puzzle index if needed
  const index = all.findIndex((p) => p.id === today.id);
  setPuzzleNumber(index + 1);
} else {
  console.warn("⚠️ No puzzle returned for today.");
}

    }
  };

  loadPuzzles();
}, [selectedPuzzleIndex]);


  const toggleTooltip = (idx) => {
  setOpenTooltip((prev) => (prev === idx ? null : idx));
};

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

   
// Check if the user already completed this puzzle
useEffect(() => {
  if (puzzle) {
    const alreadyCompleted =
      localStorage.getItem(`completed-${puzzle.date}`) === "true";
    if (alreadyCompleted) {
      setIsCorrect(true);
    }
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

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      tooltipRefs.current.every(
        (ref) => ref && !ref.contains(event.target)
      )
    ) {
      setOpenTooltip(null);
    }
  };

  if (openTooltip !== null) {
    document.addEventListener("mousedown", handleClickOutside); // 👈 changed from 'click'
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [openTooltip]);


const handleGuess = () => {
  const cleanedGuess = normalize(guess);

  if (!cleanedGuess) {
    setInputError("Please enter a guess before submitting.");
    return;
  }

  setInputError("");

  // Normalize all answers
  const allAnswers = [
    { label: normalize(puzzle.answer) },
    ...(puzzle.acceptableGuesses || puzzle.acceptable_guesses || []).map((g) => ({
      label: normalize(g),
    })),
  ];

  const fuse = new Fuse(allAnswers, {
  keys: ["label"],
  threshold: 0.65, // loosened for better fuzzy matching
  includeScore: true,
});

const [bestMatch] = fuse.search(cleanedGuess);

// 🔍 Check for essential keyword coverage (e.g. allow 2 of 3)
const essentialWords = (puzzle.essential_keywords || []).map(normalize);
const matchCount = essentialWords.filter(word => cleanedGuess.includes(word)).length;
const hasEnoughEssentials = matchCount >= 2; // Allow 2 out of 3 to match

if (bestMatch && bestMatch.score <= 0.65 && hasEnoughEssentials) {
  // ✅ Correct guess
  setIsCorrect(true);
  localStorage.setItem(`completed-${puzzle.date}`, "true");
  setStats((prev) => updateStats(prev, true, attempts + 1));

  if (typeof track === "function") {
    track("puzzle_completed", {
      correct: true,
      guessCount: attempts + 1,
      puzzleId: puzzle?.id ?? null,
    });
    track("puzzle_guess_count", {
      guessCount: attempts + 1,
      puzzleId: puzzle?.id ?? null,
    });
  }

  console.log("✅ Correct guess — showing post-game modal...");
  setTimeout(() => setShowPostGame(true), 500);
} else {
  // 🟡 Close guess?
  if (bestMatch && bestMatch.score <= 0.75) {
    setInputError(
      hasEnoughEssentials
        ? "💡 That’s close! Try again."
        : "💡 You’re close, but missing a key word."
    );

    console.log("👀 Near miss:", {
      guess: cleanedGuess,
      bestMatch: bestMatch.item.label,
      similarity: bestMatch.score.toFixed(3),
      essentialsMatched: matchCount,
    });
  } else {
    // ❌ Fully incorrect
    const fallbackMessage =
      incorrectGuessMessages[attempts] || "Not quite — try again!";
    setInputError(fallbackMessage);
  }

  const newAttempts = attempts + 1;
  setAttempts(newAttempts);

  const canReveal = newAttempts <= puzzle.clues.length;
  if (canReveal) {
    setRevealedClues((prev) =>
      revealNextClue(puzzle, prev, newAttempts, maxGuesses)
    );
  }

  if (newAttempts >= maxGuesses) {
    setStats((prev) => updateStats(prev, false));

    if (typeof track === "function") {
      track("puzzle_failed", {
        correct: false,
        attempts: newAttempts,
        puzzleId: puzzle?.id ?? null,
      });
      track("puzzle_guess_count", {
        guessCount: "✖",
        puzzleId: puzzle?.id ?? null,
      });
    }

    console.log("❌ Max attempts reached — showing post-game modal...");
    setTimeout(() => setShowPostGame(true), 500);
  }
}

setGuess("");
};
    
const handleClueReveal = () => {
  if (
    revealDisabled ||
    attempts >= maxGuesses ||
    revealedClues.length >= puzzle.clues.length
  ) return;

  setRevealDisabled(true);

  setRevealedClues([...revealedClues, puzzle.clues[revealedClues.length]]);
  setAttempts(attempts + 1);

  setTimeout(() => {
    setRevealDisabled(false);
  }, 1000); // 1 second lockout to prevent double taps
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


const renderCategoryPills = () => {
  const categories = [
    {
      label: "Maths",
      color: "bg-blue-200 text-blue-800",
      tooltip: "Equations, constants, mathematical discoveries, calculations.",
    },
    {
      label: "Geography",
      color: "bg-green-200 text-green-800",
      tooltip: "Distances, coordinates, elevations.",
    },
    {
      label: "Science",
      color: "bg-orange-200 text-orange-800",
      tooltip: "Atomic numbers, scientific constants, measurements. ",
    },
    {
      label: "History",
      color: "bg-yellow-200 text-yellow-800",
      tooltip: "Monumental events, inventions, revolutions, treaties.",
    },
    {
      label: "Culture",
      color: "bg-purple-200 text-purple-800",
      tooltip: "Movies, literature, music, art.",
    },
    {
      label: "Sport",
      color: "bg-red-200 text-red-800",
      tooltip: "World records, famous jersey numbers, stats, memorable dates.",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
{categories.map((cat, idx) => (
  <div key={idx} className="relative"
  ref={(el) => (tooltipRefs.current[idx] = el)}
  >
 
<button
  onClick={(e) => {
    e.stopPropagation();
    toggleTooltip(idx);
  }}
  className={`category-pill inline-flex items-center justify-center px-2.5 py-1 rounded-full font-semibold text-sm ${cat.color}`}
>
  <img
    src={`/icons/${cat.label.toLowerCase()}.png`}
    alt={`${cat.label} icon`}
    className="w-8 h-8 mr-0"
    style={{ marginTop: '-1px' }}
  />
  {cat.label}
</button>



{openTooltip === idx && (
  <div className="tooltip absolute bottom-full left-0 mb-2 bg-white shadow-lg p-2 rounded-md z-50 text-sm leading-snug max-w-[220px]">
    {cat.tooltip}
  </div>

)}

  </div>
))}

    </div>
  );
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
  callback={(data) => {
    console.log("🔄 Joyride event:", data);

    // End tour
    if (data.status === "finished" || data.status === "skipped") {
      setShowTour(false);
      localStorage.setItem("seenTour", "true");
      return;
    }

    // Advance only if next step exists
    if (data.type === "step:after") {
      const nextStep = stepIndex + 1;
      const nextTarget = document.querySelector(joyrideSteps[nextStep]?.target);

      if (nextTarget) {
        setStepIndex(nextStep);
      } else {
        console.warn("❌ Next Joyride step target missing:", joyrideSteps[nextStep]?.target);
        setShowTour(false);
      }
    }

    if (data.type === "target:notFound") {
      console.warn("🚫 Joyride target not found:", data.step.target);
      setShowTour(false);
    }
  }}
/>
<Header
  onHelpClick={() => setShowInstructions(true)}
  onStatsClick={() => setShowStats(true)}
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

      <Card className="w-full max-w-md p-1 text-center border-2 border-[#3B82F6] bg-white shadow-lg">
        <CardContent className="overflow-hidden">

<PostGameModal
  open={showPostGame}
  onClose={() => setShowPostGame(false)}
  isCorrect={isCorrect}
  stats={stats}
  puzzle={puzzle}
  shareResult={shareTextHandler}
  attempts={attempts}
  puzzleNumber={puzzleNumber} // ✅ Add this
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

{/* 🔐 Always-rendered input for Joyride compatibility */}
<div className="w-full max-w-md space-y-3 mt-6">
  <Input
    value={guess}
    onChange={(e) => setGuess(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!isCorrect && guess.trim()) {
          handleGuess();
        }
      }
    }}
    placeholder="Enter your guess..."
    className="w-full guess-input"
    disabled={!puzzle || isCorrect || attempts >= maxGuesses}
  />
</div>

{/* Conditional Game Feedback */}
{isCorrect ? (
  <>
    <p className="text-green-600 mt-4">Correct! The answer is {puzzle.answer}.</p>
    <div className="mt-6 text-center space-y-3">
      <p className="text-lg font-semibold text-gray-800">Come back tomorrow for your next workout!</p>
      <p className="text-sm text-gray-600">
        Next puzzle in: <span className="font-mono">{countdown}</span>
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-4 shadow-sm">
        <p className="text-sm text-blue-900 font-medium mb-2">
          💬 Love Numerus? Loathe it? Let us know what you think!
        </p>
        <a
          href="https://forms.gle/LifsBp42q2KBJRRK7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Fill out the Feedback Form
        </a>
      </div>
    </div>
  </>
) : attempts >= maxGuesses ? (
  <>
    <p className="text-red-600 mt-4">
      Unlucky, better luck tomorrow! The correct answer was {puzzle.answer}.
    </p>
    <div className="mt-6 text-center space-y-3">
      <p className="text-lg font-semibold text-gray-800">Come back tomorrow for your next workout!</p>
      <p className="text-sm text-gray-600">
        Next puzzle in: <span className="font-mono">{countdown}</span>
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-4 shadow-sm">
        <p className="text-sm text-blue-900 font-medium mb-2">
          💬 Love Numerus? Loathe it? Let us know what you think!
        </p>
        <a
          href="https://forms.gle/LifsBp42q2KBJRRK7"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Fill out the Feedback Form
        </a>
      </div>
    </div>
  </>
) : (
  <>
    {inputError && (
      <p className="text-red-500 text-sm text-center mt-4">{inputError}</p>
    )}
    <p className="text-sm text-gray-600 mb-1 text-center">
      {maxGuesses - attempts} guess{maxGuesses - attempts !== 1 ? "es" : ""} remaining
    </p>
    <div className="flex flex-row md:flex-col justify-between gap-2 w-full max-w-xs mx-auto">
      <Button
        onClick={handleClueReveal}
        disabled={
          revealDisabled ||
          !puzzle ||
          revealedClues.length >= puzzle.clues.length ||
          attempts >= maxGuesses
        }
        variant="outline"
        className={`reveal-button w-full transition-transform duration-300 ease-in-out ${
          revealedClues.length === 0 && attempts < maxGuesses ? "animate-pulse-grow" : ""
        }`}
      >
        Reveal a Clue
      </Button>

      <Button
        onClick={handleGuess}
        className="w-full bg-[#3B82F6] text-white"
      >
        Submit
      </Button>
    </div>
  </>
)}

    </div>
  </div>

  <div className="w-full max-w-sm mx-auto px-2">
    <OnScreenKeyboard
      onKeyPress={(key) => {
        if (key === "↵") {
          handleGuess();
        } else if (key === "←") {
          setGuess((prev) => prev.slice(0, -1));
        } else if (key === "␣") {
          setGuess((prev) => prev + " ");
        } else if (key === "Clear") {
          setGuess("");
        } else {
          setGuess((prev) => prev + key.toLowerCase());
        }
      }}
    />
  </div>
</>
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
        Type what you think the number relates to (e.g. 'light speed', 'year of the moon landing').
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

      <div className="flex justify-center mt-2">
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 w-full max-w-md text-center shadow-md">
          <h3 className="text-lg font-bold mb-1 text-gray-800">Categories</h3>
          <p className="text-sm text-gray-600 mb-3">Tap the buttons below to explore the categories in more detail.</p>
          {renderCategoryPills()}
        </div>
      </div>
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


<footer className="text-center text-sm text-gray-500 mt-10 pb-4">
  © {new Date().getFullYear()} B Puzzled. All rights reserved.
</footer>
    </div>
  </>
);
}
