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
import puzzles from "../data/puzzles";
import { useRef } from "react";
import FunFactBox from "../components/FunFactBox";
import PostGameModal from "../components/PostGameModal";
import { X } from "lucide-react";
import { shareResult } from "../utils/share";


const colorClassMap = {
  blue: "text-blue-700 bg-blue-100 hover:bg-blue-200",
  green: "text-green-700 bg-green-100 hover:bg-green-200",
  maroon: "text-red-900 bg-red-100 hover:bg-red-200",
  yellow: "text-yellow-700 bg-yellow-100 hover:bg-yellow-200",
  purple: "text-purple-700 bg-purple-100 hover:bg-purple-200",
  red: "text-red-700 bg-red-100 hover:bg-red-200",
};

  export default function Home() {
    
  const [openTooltip, setOpenTooltip] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
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

  const toggleTooltip = (idx) => {
  setOpenTooltip((prev) => (prev === idx ? null : idx));
};

  const maxGuesses = 4;

const getResultImage = () => {
  if (!isCorrect && attempts >= maxGuesses) return "/images/tomorrow.png";
  if (isCorrect) {
    switch (attempts + 1) {
      case 1:
        return "/images/gotitinone.png";
      case 2:
        return "/images/second.png";
      case 3:
        return "/images/thirdtime.png";
      case 4:
        return "/images/squeaky.png";
    }
  }
  return null;
};

    
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, failed: 0 },
  });

  useEffect(() => {
     const savedStats = localStorage.getItem("numerusStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("numerusStats", JSON.stringify(stats));
  }, [stats]);

useEffect(() => {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  setPuzzle(puzzles[randomIndex]);
  setDateString(new Date().toLocaleDateString());
}, []);

  
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Loading puzzle...</p>
      </div>
    );
  }


   const handleGuess = () => {
   const cleanedGuess = guess.trim();

    if (!cleanedGuess) {
      setInputError("Please enter a guess before submitting.");
      return;
    }

    setInputError(""); // Clear error if guess is valid

    if (
      cleanedGuess.toLowerCase() === puzzle.answer.toLowerCase().trim() ||
      puzzle.keywords?.some((keyword) =>
        cleanedGuess.toLowerCase().includes(keyword.toLowerCase())
      )
    ) {
      // Correct guess
      setIsCorrect(true);
      setStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentStreak: prev.currentStreak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.currentStreak + 1),
        guessDistribution: {
          ...prev.guessDistribution,
          [attempts + 1]: (prev.guessDistribution[attempts + 1] || 0) + 1,
        },
      }));

      } else {
   const nextAttempts = attempts + 1;

  setAttempts(nextAttempts);

  // Reveal a clue
  if (nextAttempts <= puzzle.clues.length) {
    setRevealedClues((prev) => [...prev, puzzle.clues[nextAttempts - 1]]);
  }

  // Final guess = mark as failed
  if (nextAttempts >= maxGuesses) {
    setStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      currentStreak: 0,
      guessDistribution: {
        ...prev.guessDistribution,
        failed: (prev.guessDistribution.failed || 0) + 1,
      },
    }));
  }

  // Always trigger post-game modal if final guess is made
  if (nextAttempts >= maxGuesses) {
    setTimeout(() => setShowPostGame(true), 500);
  }
}


// Trigger modal after final guess or correct answer
let finalGuessMade = false;

if (
  cleanedGuess.toLowerCase() === puzzle.answer.toLowerCase().trim() ||
  puzzle.keywords?.some((keyword) =>
    cleanedGuess.toLowerCase().includes(keyword.toLowerCase())
  )
) {
  finalGuessMade = true;
} else {
   const newAttempts = attempts + 1;

  if (newAttempts >= maxGuesses) {
    finalGuessMade = true;
  }
}

// Slight delay to allow feedback before showing modal
if (finalGuessMade) {
  setTimeout(() => setShowPostGame(true), 500);
}

setGuess("");

  };

  const handleClueReveal = () => {
    if (attempts >= maxGuesses || revealedClues.length >= puzzle.clues.length) return;
    setRevealedClues([...revealedClues, puzzle.clues[revealedClues.length]]);
    setAttempts(attempts + 1);
  };

const shareTextHandler = () => {
  shareResult({ isCorrect, attempts });

  // Optional analytics tracking
  if (typeof track === "function") {
    track("share_clicked", {
      correct: isCorrect,
      attempts: attempts,
      puzzleId: puzzle?.id ?? null,
    });
  }
};


  // Pie chart data
  const data = [
    { name: "1 Guess", value: stats.guessDistribution[1] },
    { name: "2 Guesses", value: stats.guessDistribution[2] },
    { name: "3 Guesses", value: stats.guessDistribution[3] },
    { name: "4 Guesses", value: stats.guessDistribution[4] },
    { name: "Failed", value: stats.guessDistribution.failed || 0 },
  ];

  // Sum of all slices
  const totalGames = data.reduce((sum, entry) => sum + entry.value, 0);

  const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB", "#F87171"];

const renderCenterLabel = ({ viewBox }) => {
  const { cx, cy } = viewBox;

  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#3B82F6"
      fontSize={16}
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      <tspan x={cx} dy="-0.6em">Guess</tspan>
      <tspan x={cx} dy="1.2em">Distribution</tspan>
    </text>
  );
};


  const combinedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, value
}) => {
  if (!value) return null;

  const RADIAN = Math.PI / 180;
  const labelMap = ["1", "2", "3", "4", "✖"];

  // Inner label position
  const innerRadiusMid = innerRadius + (outerRadius - innerRadius) / 2;
  const xInner = cx + innerRadiusMid * Math.cos(-midAngle * RADIAN);
  const yInner = cy + innerRadiusMid * Math.sin(-midAngle * RADIAN);

  // Outer percentage label position
  const xOuter = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
  const yOuter = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);



  return (
    <>
      {/* Label inside slice */}
<text
  x={xInner}
  y={yInner}
  fill="#FFFFFF" 
  fontSize={14}
  fontWeight="bold"
  textAnchor="middle"
  dominantBaseline="central"
>
  {labelMap[index] === "❌" ? "✖" : labelMap[index]}

</text>


      {/* Label outside slice */}
      {percent > 0 && (
        <text
          x={xOuter}
          y={yOuter}
          fill="#000000"
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )}
    </>
  );
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
      color: "bg-pink-200 text-pink-800",
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
  className={`category-pill px-3 py-1 rounded-full font-semibold ${cat.color}`}
>
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
  <div className="flex flex-col items-center p-4 space-y-4 bg-white min-h-screen">
      <div className="w-full bg-[#3B82F6] p-2 flex items-center justify-between h-14">
        {/* Centered logo */}
        <div className="flex flex-1 justify-center">
          <img src="/logo.svg" alt="Game Logo" className="h-40 w-auto max-h-full mt-6" />
        </div>
        {/* Buttons on the right */}
        <div className="flex space-x-4">
          <Button
            onClick={() => setShowInstructions(true)}
            className="bg-white text-black font-bold border border-[#3B82F6] px-4 py-2 rounded-lg hover:bg-[#3B82F6] hover:text-white transition"
          >
            How to Play
          </Button>
          <Button
            onClick={() => setShowStats(true)}
            className="bg-white border border-[#3B82F6] px-4 py-2 rounded-lg hover:bg-[#3B82F6] hover:text-white transition"
          >
            <BarChart size={20} />
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold">Today's number is:</h1>

      <Card className="w-full max-w-md p-1 text-center border-2 border-[#3B82F6] bg-white shadow-lg">
        <CardContent className="overflow-hidden">

  <PostGameModal
  open={showPostGame}
  onClose={() => setShowPostGame(false)}
  isCorrect={isCorrect}
  stats={stats}
  puzzle={puzzle}
  shareResult={shareResult}
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


 
{(isCorrect || attempts >= maxGuesses) && (
  <div className="flex flex-col items-center mt-6 gap-4">

    <img
      src={getResultImage()}
      alt="Result"
      className="w-48 h-auto block mt-2"
    />
  </div>
)}


  </>
) : attempts >= maxGuesses ? (

            <>
              <p className="text-red-600 mt-4">
                Unlucky, better luck tomorrow! The correct answer was {puzzle.answer}.
              </p>


            </>
          ) : (
            
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


  <div className="mt-4 flex flex-col space-y-2">
    {inputError && (
      <p className="text-red-500 text-sm text-center">{inputError}</p>
    )}

    <p className="text-sm text-gray-600 mb-1 text-center">
      {maxGuesses - attempts} guess{maxGuesses - attempts !== 1 ? "es" : ""} remaining
    </p>

    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
      <Input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess..."
        className="flex-1"
      />
      <Button onClick={handleGuess} className="bg-[#3B82F6] text-white">
        Submit
      </Button>
      <Button
        onClick={handleClueReveal}
        disabled={revealedClues.length >= puzzle.clues.length || attempts >= maxGuesses}
        variant="outline"
      >
        Reveal a Clue
      </Button>
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
        <p className="text-lg font-semibold">{dateString}</p>
        <p className="text-md font-medium">No. {stats.gamesPlayed + 1}</p>
      </div>

{isCorrect && (
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
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-md w-full flex flex-col">
             {/* Dismiss Button */}
    <button
      className="absolute top-4 right-4 m-5 p-2 text-blue-500 hover:text-blue-600 transition"
      onClick={() => setShowInstructions(false)}
      aria-label="Close"
    >
      <X size={28} />
    </button>
      
        <DialogHeader>
            <DialogTitle>
              <h2 className="text-lg text-gray-800 mb-4">How To Play</h2>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 font-sans">
</div>

         
<ul className="list-decimal ml-6">
  <li>
    <strong>Look at the number.</strong><br />
    What could it mean?<br /><br />
  </li>
  <li>
    <strong>Make a guess. You have 4 in total.</strong><br />
    Type what you think the number relates to (e.g., 'speed of light', 'year of the moon landing').<br /><br />
  </li>
  <li>
    <strong>Stuck? Reveal a clue!</strong><br />
    Remember though, this uses up a guess.<br /><br />
  </li>
</ul>

<div className="flex justify-center mt-0">
  <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 w-full max-w-md text-center shadow-md">
<h3 className="text-lg font-bold mb-1 text-gray-800">Categories</h3>
<p className="text-sm text-gray-600 mb-3">Tap the buttons below to explore the categories in more detail.</p>
{renderCategoryPills()}

  </div>
</div>

        </DialogContent>
      </Dialog>

{/* Stats Popup */}
<Dialog open={showStats} onOpenChange={setShowStats}>
  <DialogContent className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 pt-10 overflow-hidden">

   {/* Title */}
    <h2 className="text-lg text-gray-800 mb-4">Statistics</h2>
  
{/* Dismiss Button */}
    <button
  className="absolute top-4 right-4 m-5 p-2 text-blue-500 hover:text-blue-600 transition"

      onClick={() => setShowStats(false)}
      aria-label="Close"
    >
      <X size={28} />
    </button>

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
</Dialog>
    </div>
  </>
);
}

