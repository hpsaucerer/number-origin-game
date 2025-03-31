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

export default function NumberOriginGame() {
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

  const maxGuesses = 4;

  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, failed: 0 },
  });

  useEffect(() => {
    const savedStats = localStorage.getItem("numberOriginStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("numberOriginStats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    setPuzzle(puzzles[randomIndex]);
    setDateString(new Date().toLocaleDateString());
  }, []);

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
      // Incorrect guess
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Reveal a clue only after first wrong guess
      if (newAttempts <= puzzle.clues.length) {
        setRevealedClues((prev) => [...prev, puzzle.clues[newAttempts - 1]]);
      }

      // Final guess = mark as failed
      if (newAttempts >= 4) {
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
    }

    setGuess("");
  };

  const handleClueReveal = () => {
    if (attempts >= maxGuesses || revealedClues.length >= puzzle.clues.length) return;
    setRevealedClues([...revealedClues, puzzle.clues[revealedClues.length]]);
    setAttempts(attempts + 1);
  };

  const shareResult = () => {
    const message = `I solved today’s Number Origin puzzle in ${attempts + 1} attempts! Try it: [game link]`;
    navigator.clipboard.writeText(message);
    alert("Result copied to clipboard! Share it with your friends.");
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
  const labelMap = ["1", "2", "3", "4", "❌"];

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
        fill="#ffffff"
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {labelMap[index]}
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


  return (

<>
  <div className="flex flex-col items-center p-4 space-y-4 bg-white min-h-screen">
      <div className="w-full bg-[#3B82F6] p-2 flex items-center justify-between h-14">
        {/* Centered logo */}
        <div className="flex flex-1 justify-center">
          <img src="/logo.png" alt="Game Logo" className="h-40 w-auto max-h-full mt-6" />
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

      <Card className="w-full max-w-md p-6 text-center border-2 border-[#3B82F6] bg-white shadow-lg">
        <CardContent className="overflow-hidden">
              
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
              {puzzle.funFact && (
                <div className="flex items-center gap-3 p-2 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded shadow">
                  <img
                    src="/icons/funfact.png"
                    alt="Fun Fact Icon"
                    className="w-32 h-auto"
                  />
                  <p className="text-sm leading-snug">{puzzle.funFact}</p>
                </div>
              )}
            </>
          ) : attempts >= maxGuesses ? (
            <>
              <p className="text-red-600 mt-4">
                Unlucky, better luck tomorrow! The correct answer was {puzzle.answer}.
              </p>
              {puzzle.funFact && (
                <div className="mt-2 p-4 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded shadow flex items-start gap-1">
                  <img
                    src="/icons/funfact.png"
                    alt="Fun Fact Icon"
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <p>{puzzle.funFact}</p>
                  </div>
                </div>
              )}
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
        <Button onClick={shareResult} className="flex items-center space-x-2">
          <Share2 size={16} /> <span>Share</span>
        </Button>
      )}

      {/* Instructions Popup */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-md w-full flex flex-col">
          <DialogHeader>
            <DialogTitle>
              <strong>How To Play</strong>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 font-sans">
</div>

         
          <p>
           
          </p>
          <p></p>
          <ul className="list-decimal ml-6">
            <li>
              <strong>Look at the number.</strong>< br/>
              What could it mean?< br/>< br/>
            </li>
            <li>
              <strong>Make a guess.</strong>< br/>
              Type what you think the number relates to (e.g., 'speed of light', 'year of the moon landing'.< br/>< br/>
            </li>
            <li>
              <strong>Use clues wisely.</strong>< br/>
              With each incorrect guess, a clue is revealed. You have 4 guesses - use them well!
            </li>
          </ul>

 <p className="mt-4">
            Categories in the game: 
          </p>
          <ul className="list-disc ml-6">
            <li className="flex items-start gap-2 mb-2">
              <img src="/icons/math.jpg" alt="Math Icon" className="w-5 h-5 mt-1" />
              <div>
                <strong className="block"><span className="text-blue-500 font-semibold">Mathematical</span></strong>
                <span></span>
              </div>
            </li>
            <li className="flex items-start gap-2 mb-2">
              <img src="/icons/geo.jpg" alt="Math Icon" className="w-5 h-5 mt-1" />
              <div>
                <strong className="block"><span className="text-green-600 font-semibold">Geographical</span></strong>
                <span>
                </span>
              </div>
            </li>
            <li className="flex items-start gap-2 mb-2">
              <img src="/icons/science.jpg" alt="Math Icon" className="w-5 h-5 mt-1" />
              <div>
                <strong className="block"><span className="text-red-900 font-semibold">Scientific</span></strong>
                <span></span>
              </div>
            </li>
            <li className="flex items-start gap-2 mb-2">
              <img src="/icons/history.jpg" alt="Math Icon" className="w-5 h-5 mt-1" />
              <div>
                <strong className="block"><span className="text-yellow-400 font-semibold">Historical</span></strong>
                <span></span>
              </div>
            </li>
            <li className="flex items-start gap-2 mb-2">
              <img src="/icons/culture.jpg" alt="Math Icon" className="w-5 h-5 mt-1" />
              <div>
                <strong className="block"><span className="text-purple-600 font-semibold">Cultural</span></strong>
                <span>
                </span>
              </div>
            </li>
            <li className="flex items-start gap-2 mb-2">
              <img src="/icons/sport.jpg" alt="Math Icon" className="w-5 h-5 mt-1" />
              <div>
                <strong className="block"><span className="text-red-500 font-semibold">Sport</span></strong>
                <span>
                </span>
              </div>
            </li>
          </ul>


          <p className="mt-2">
           
          </p>
        </DialogContent>
      </Dialog>

      {/* Stats Popup */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Statistics</DialogTitle>
          </DialogHeader>

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
              <p className="text-sm text-gray-600">
                Current
                <br />
                Streak
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.maxStreak}</p>
              <p className="text-sm text-gray-600">
                Max
                <br />
                Streak
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">

<div className="flex flex-col items-center space-y-0">
<img
  src="/icons/Ring-icon.png"
  alt="Ring o' Results Icon"
  className="w-18 h-auto mb-[-72px]"

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



          </div>
        </DialogContent>
      </Dialog>
    </div>
  </>       
  );
}
