"use client";

import WelcomeModal from "../components/WelcomeModal";
import InteractiveTutorial from "../components/InteractiveTutorial";
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
import { fetchTodayPuzzle } from "@/lib/api";

const DEV_MODE = true;

const colorClassMap = {
  blue: "text-blue-700 bg-blue-100 hover:bg-blue-200",
  green: "text-green-700 bg-green-100 hover:bg-green-200",
  maroon: "text-red-900 bg-red-100 hover:bg-red-200",
  yellow: "text-yellow-700 bg-yellow-100 hover:bg-yellow-200",
  purple: "text-purple-700 bg-purple-100 hover:bg-purple-200",
  red: "text-red-700 bg-red-100 hover:bg-red-200",
};

  export default function Home() {
  const { stats, data, COLORS, renderCenterLabel, combinedLabel } = useStats(); 
  const [openTooltip, setOpenTooltip] = useState(null);
  const [dateString, setDateString] = useState("");
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [revealedClues, setRevealedClues] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [inputError, setInputError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const tooltipRefs = useRef([]);
  const [showPostGame, setShowPostGame] = useState(false);
  const { puzzle: dailyPuzzle, puzzleNumber: dailyNumber } = useDailyPuzzle();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(null);

const { puzzle, puzzleNumber } = useDailyPuzzle(DEV_MODE ? selectedPuzzleId : null);



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

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [openTooltip]);


if (!puzzle) {
  return <ComingSoon nextDate={countdown} />;
}

const handleGuess = () => {
  if (!isValidGuess(guess)) {
    setInputError("Please enter a guess before submitting.");
    return;
  }

  setInputError(""); // Clear error

const didWin = isCorrectGuess(
  guess,
  puzzle.answer,
  puzzle.acceptableGuesses || []
);

const wasClose = isCloseGuess(guess, puzzle.keywords || []);
setInputError(!didWin && wasClose ? "💡 That’s close! Try again." : "");

if (didWin) {
  setIsCorrect(true);
  localStorage.setItem(`completed-${puzzle.date}`, "true");
  setStats((prev) => updateStats(prev, true, attempts + 1));

  // ✅ Track correct guess
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

  // ✅ Show modal after a correct guess
  setTimeout(() => setShowPostGame(true), 500);
} else {
  const newAttempts = attempts + 1;
  setAttempts(newAttempts);

  if (newAttempts <= puzzle.clues.length) {
    setRevealedClues((prev) =>
      revealNextClue(puzzle, prev, newAttempts, maxGuesses)
    );
  }

  if (newAttempts >= maxGuesses) {
    setStats((prev) => updateStats(prev, false));

    // ❌ Track failed game
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

    // ✅ Show modal after final incorrect guess
    setTimeout(() => setShowPostGame(true), 500);
  }
}



  ("");
};



  const handleClueReveal = () => {
    if (attempts >= maxGuesses || revealedClues.length >= puzzle.clues.length) return;
    setRevealedClues([...revealedClues, puzzle.clues[revealedClues.length]]);
    setAttempts(attempts + 1);
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
      tooltip: "Distances, coordinates, elevations, statistics.",
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


  return (
<>
<WelcomeModal
  open={showWelcome}
  onOpenChange={setShowWelcome}
  showTutorial={showTutorial}
  setShowTutorial={setShowTutorial}
/>

<InteractiveTutorial
  open={showTutorial}
  onClose={() => setShowTutorial(false)}
/>

<header>
  <div className="bg-[#3B82F6] px-4 py-2 flex items-center justify-between h-16 max-w-screen-lg w-full mx-auto">
    {/* Left Side: Hamburger + Logo */}
    <div className="flex items-center gap-0 sm:gap-3">
      {/* Hamburger + Dropdown */}
      <div className="relative flex items-start">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl font-bold px-1 hover:text-blue-200"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg z-50 transition-all duration-200 ease-out">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
            >
              Daily Puzzle
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
            >
              About
            </Link>
                <Link
  href="/contact"
  onClick={() => setMenuOpen(false)}
  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
>
  Contact
</Link>

          </div>
        )}
      </div>

      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img
          src="/logo.svg"
          alt="Game Logo"
          className="h-18 sm:h-16 md:h-20 lg:h-28 xl:h-52 w-auto translate-y-4"
        />
      </Link>
    </div>

    {/* Right-side icon buttons */}
    <div className="flex items-center space-x-3">
      <Button
        onClick={() => setShowInstructions(true)}
        className="bg-white border border-[#3B82F6] px-3 py-2 rounded-lg hover:bg-[#3B82F6] hover:text-white transition shadow-md"
        title="How to Play"
        aria-label="How to Play"
      >
        <BookOpen size={20} strokeWidth={2.25} className="text-[#3B82F6]" />
      </Button>

      <Button
        onClick={() => setShowStats(true)}
        className="group bg-white border border-[#3B82F6] px-2 py-1 rounded hover:bg-[#3B82F6] hover:text-white transition"
        title="Your Stats"
        aria-label="Your Stats"
      >
        <BarChart size={20} className="text-[#3B82F6] group-hover:text-white transition" />
      </Button>
    </div>
  </div>
</header>

    
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
      {puzzles.map((p, i) => (
        <option key={p.date} value={i}>
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
    
            
<p className="text-4xl font-bold text-[#3B82F6] font-daysone">
  {isCorrect ||
  (puzzle.revealFormattedAt &&
    revealedClues.length >= puzzle.revealFormattedAt)
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


  <div className="mt-4 flex flex-col space-y-2">
    {inputError && (
      <p className="text-red-500 text-sm text-center">{inputError}</p>
    )}

    <p className="text-sm text-gray-600 mb-1 text-center">
      {maxGuesses - attempts} guess{maxGuesses - attempts !== 1 ? "es" : ""} remaining
    </p>

<div className="w-full max-w-md space-y-3">
  {/* Input field */}
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
  className="w-full"
  disabled={isCorrect}
/>



  {/* Buttons in a row */}
<div className="flex flex-row md:flex-col justify-between gap-2 w-full max-w-xs mx-auto">
  <Button
    onClick={handleClueReveal}
    disabled={revealedClues.length >= puzzle.clues.length || attempts >= maxGuesses}
    variant="outline"
    className={`w-full transition-transform duration-300 ease-in-out ${
      !showWelcome &&
      revealedClues.length < puzzle.clues.length &&
      attempts < maxGuesses
        ? "animate-pulse-grow"
        : ""
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
      <p className="text-lg font-semibold">
  {new Date().toLocaleDateString("en-GB", { timeZone: "Europe/London" })}
</p>
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
  <DialogContent className="relative max-h-[90vh] overflow-y-auto p-6 sm:max-w-md w-full flex flex-col items-start justify-center">
    {/* Dismiss Button */}
    <button
      className="absolute top-1 right-1 p-2 text-blue-500 hover:text-blue-600 transition"
      onClick={() => setShowInstructions(false)}
      aria-label="Close"
    >
      <X size={28} />
    </button>

    <DialogHeader>
      <DialogTitle>
        <h2 className="text-lg text-gray-800 -mb-2 text-left">How To Play</h2>
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


{/* Stats Popup */}
<Dialog open={showStats} onOpenChange={setShowStats}>
   <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
 <DialogContent className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 pt-10 overflow-y-auto max-h-[90vh] flex flex-col items-center justify-center">

    {/* Dismiss Button */}
    <button
      onClick={() => setShowStats(false)}
      aria-label="Close"
      className="absolute top-1 right-1 p-2 text-blue-500 hover:text-blue-600 transition"
    >
      <X size={28} />
    </button>
   {/* Title */}
<div className="w-full flex flex-col items-start">
  <DialogHeader>
    <DialogTitle>
      <h2 className="text-lg text-gray-800 mb-4 text-left">Statistics</h2>
    </DialogTitle>
  </DialogHeader>
</div>

    {/* Formatted stat boxes */}
    <div className="grid grid-cols-4 gap-4 text-center my-6">
      <div>
        <p className="text-3xl font-bold">{stats.gamesPlayed}</p>
        <p className="text-sm text-gray-600">Played</p>
      </div>
      <div>
        <p className="text-3xl font-bold">
          {stats.gamesPlayed > 0
            ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
            : 0}
        </p>
        <p className="text-sm text-gray-600">Win %</p>
      </div>
      <div>
        <p className="text-3xl font-bold">{stats.currentStreak}</p>
        <p className="text-sm text-gray-600">Current<br />Streak</p>
      </div>
      <div>
        <p className="text-3xl font-bold">{stats.maxStreak}</p>
        <p className="text-sm text-gray-600">Max<br />Streak</p>
      </div>
    </div>

    {/* Chart + Ring Icon */}
    <div className="flex flex-col items-center space-y-4">
      <img
        src="/icons/Ring-icon.png"
        alt="Ring o' Results"
        className="w-36 h-36 mx-auto mb-[-64px]"
      />

      <ResponsiveContainer width={300} height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label={combinedLabel}
            labelLine={false}
            isAnimationActive={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label content={renderCenterLabel} position="center" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  </DialogContent>
</div>
</Dialog>
<footer className="text-center text-sm text-gray-500 mt-10 pb-4">
  © {new Date().getFullYear()} B Puzzled. All rights reserved.
</footer>
    </div>
  </>
);
}
  
