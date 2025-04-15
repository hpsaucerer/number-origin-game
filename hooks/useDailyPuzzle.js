import { useEffect, useState } from "react";

export const useDailyPuzzle = (puzzles) => {
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleNumber, setPuzzleNumber] = useState(null);

  useEffect(() => {
    const today = "2025-04-15"; // ⬅️ Match this to your test puzzle's date
    const todayPuzzle = puzzles.find((p) => p.date === today);

    if (todayPuzzle) {
      setPuzzle(todayPuzzle);
      // Get index in case you still want to show puzzle #n
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
