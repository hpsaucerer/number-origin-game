// pages/api/validate-guess.js
import puzzles from "@/data/puzzles"; // Adjust path if needed

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { guess, puzzleId, attempt } = req.body;
  const puzzle = puzzles[puzzleId];

  if (!puzzle) {
    return res.status(404).json({ error: "Puzzle not found" });
  }

  const cleanedGuess = guess.trim().toLowerCase();
  const isCorrect =
    cleanedGuess === puzzle.answer.toLowerCase() ||
    puzzle.keywords?.some((k) => cleanedGuess.includes(k.toLowerCase()));

  const nextClue = !isCorrect && attempt < puzzle.clues.length
    ? puzzle.clues[attempt]
    : null;

  const gameOver = attempt >= 3 && !isCorrect;

  res.status(200).json({
    correct: isCorrect,
    nextClue,
    gameOver,
  });
}
