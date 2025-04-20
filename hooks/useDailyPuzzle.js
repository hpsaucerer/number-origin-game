import { useEffect, useState } from "react";

export const useDailyPuzzle = (puzzles) => {
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleNumber, setPuzzleNumber] = useState(null);

  const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE;

  useEffect(() => {
    const today = LAUNCH_DATE || new Date().toISOString().split("T")[0];
    const todayPuzzle = puzzles.find((p) => p.date === today);

    if (todayPuzzle) {
      setPuzzle(todayPuzzle);
      const index = puzzles.findIndex((p) => p.date === today);
      setPuzzleNumber(index + 1);
    } else {
      setPuzzle(null);
      setPuzzleNumber(null);
      console.warn("⚠️ No puzzle found for today’s date:", today);
    }
  }, [puzzles]);

  return { puzzle, puzzleNumber };
};
