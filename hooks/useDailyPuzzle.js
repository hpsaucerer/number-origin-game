import { useEffect, useState } from "react";

export const useDailyPuzzle = (puzzles) => {
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleNumber, setPuzzleNumber] = useState(null);
  const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE;

  useEffect(() => {
    if (!puzzles || !Array.isArray(puzzles)) return;

    // 🧠 Only run this on the client
    const date = LAUNCH_DATE || (typeof window !== "undefined"
      ? new Date().toISOString().split("T")[0]
      : null);

    if (!date) return;

    const todayPuzzle = puzzles.find((p) => p.date === date);

    if (todayPuzzle) {
      setPuzzle(todayPuzzle);
      const index = puzzles.findIndex((p) => p.date === date);
      setPuzzleNumber(index + 1);
    } else {
      setPuzzle(null);
      setPuzzleNumber(null);
      console.warn("⚠️ No puzzle found for today’s date:", date);
    }
  }, [puzzles, LAUNCH_DATE]);

  return { puzzle, puzzleNumber };
};
