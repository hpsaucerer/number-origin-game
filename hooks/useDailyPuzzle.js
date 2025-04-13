import { useEffect, useState } from "react";

const getDayIndex = (startDateStr) => {
  const launchDate = new Date(startDateStr);
  const today = new Date();
  return Math.floor((today - launchDate) / (1000 * 60 * 60 * 24));
};

export const useDailyPuzzle = (puzzles, startDate = "2024-04-22") => {
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleNumber, setPuzzleNumber] = useState(null);

  useEffect(() => {
    const dayIndex = getDayIndex(startDate);

    if (dayIndex >= 0 && dayIndex < puzzles.length) {
      setPuzzle(puzzles[dayIndex]);
      setPuzzleNumber(dayIndex + 1);
    } else {
      setPuzzle(null); // Optional: set a fallback puzzle or error state
    }
  }, [puzzles, startDate]);

  return { puzzle, puzzleNumber };
};

