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
          Type what you think the number could relate to; e.g. <em>'keys on a piano'</em>, <em>'moon landing'</em> etc.
        </p>
        <p>
          <strong>You have 4 guesses to solve the puzzle.</strong>
        </p>
      </div>
    ),
  },
  {
    target: ".reveal-button",
    content: "Need help? Reveal a clue! Remember though, each time you do, this uses up a guess.",
    disableBeacon: true,
    disableScrolling: true,
    wait: 500
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
  const [animateClueButton, setAnimateClueButton] = useState(true);

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
  if (!puzzle || !hasMounted || localStorage.getItem("seenTour") === "true") return;

  let attempts = 0;
  const maxTries = 10;

  const tryStartTour = () => {
    const input = document.querySelector(".guess-input");
    const clue = document.querySelector(".reveal-button");
    const daily = document.querySelector(".daily-number");
    const stats = document.querySelector(".stats-button");

    if (daily && input && clue && stats) {
      console.log("✅ Joyride: All targets found.");
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

const handleGuess = async (isClueReveal = false) => {
  const cleanedGuess = normalize(guess);
  const puzzleId = puzzle?.id ?? 0;

  if (!isClueReveal && !cleanedGuess) {
    setInputError("Please enter a guess before submitting.");
    return;
  }

  setInputError("");

  try {
    const res = await fetch("/api/validate-guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guess: cleanedGuess,
        attempt: attempts,
        puzzleId,
        isClueReveal,
      }),
    });

    const result = await res.json();

    if (result.correct) {
      setIsCorrect(true);
      localStorage.setItem(`completed-${puzzle.date}`, "true");
      setStats((prev) => updateStats(prev, true, attempts + 1));
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
      setTimeout(() => setShowPostGame(true), 500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (result.nextClue) {
        setRevealedClues((prev) => [...prev, result.nextClue]);
      }

      if (result.feedbackMessage && !isClueReveal) {
        setInputError(result.feedbackMessage);
      }

      if (result.gameOver) {
        setStats((prev) => updateStats(prev, false));
        if (typeof track === "function") {
          track("puzzle_failed", {
            correct: false,
            attempts: newAttempts,
            puzzleId,
          });
          track("puzzle_guess_count", {
            guessCount: "✖",
            puzzleId,
          });
        }
        setTimeout(() => setShowPostGame(true), 500);
      }
    }

    setGuess("");
  } catch (error) {
    console.error("❌ Error validating guess:", error);
    setInputError("Something went wrong. Try again!");
  }
};


const handleClueReveal = () => {
    if (
    revealDisabled || 
    attempts >= maxGuesses || 
    revealedClues.length >= puzzle?.clues?.length // 👈 prevent over-revealing
  ) return;

  setRevealDisabled(true);
  setAnimateClueButton(false);

  handleGuess(true); // This now handles clue reveal via backend

  setTimeout(() => {
    setRevealDisabled(false);
    setAnimateClueButton(true);
  }, 1000);
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
  locale={{                      // ✅ Moved inside the Joyride component props
    last: "Play",
    back: "Back",
    next: "Next",
    skip: "Skip",
  }}

callback={(data) => {
  console.log("🔄 Joyride event:", data);

  // End tour if finished or skipped
  if (data.status === "finished" || data.status === "skipped") {
    setShowTour(false);
    localStorage.setItem("seenTour", "true");
    return;
  }

  // Handle advancing between steps
  if (data.type === "step:after") {
    const nextStep = stepIndex + 1;
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
            console.log(`✅ Retry succeeded: advancing to step ${nextStep}`);
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

      <Button
        onClick={handleGuess}
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
