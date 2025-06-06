import { supabase } from "@/lib/supabase";
import Fuse from "fuse.js";

function normalize(str) {
  return str?.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ") ?? "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { guess, puzzleId, attempt } = req.body;

  if (!puzzleId) {
    return res.status(400).json({ error: "Missing puzzleId" });
  }

  const { data: puzzle, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("id", puzzleId)
    .single();

  if (error || !puzzle) {
    console.error("❌ Supabase error fetching puzzle:", error);
    return res.status(404).json({ error: "Puzzle not found" });
  }

  const cleanedGuess = normalize(guess);
  const allAnswers = [
    { label: normalize(puzzle.answer) },
    ...(puzzle.acceptable_guesses || []).map((g) => ({
      label: normalize(g),
    })),
  ];

  const fuse = new Fuse(allAnswers, {
    keys: ["label"],
    threshold: 0.45,
    includeScore: true,
  });

  const [bestMatch] = fuse.search(cleanedGuess);

  const essentialWords = (puzzle.essential_keywords || []).map(normalize);
  const matchCount = essentialWords.filter((word) => cleanedGuess.includes(word)).length;
  const hasEnoughEssentials = matchCount >= 2;

  let isCorrect = false;
  if (bestMatch && bestMatch.score <= 0.5 && hasEnoughEssentials) {
    isCorrect = true;
  }

  const clues = puzzle.clues || [];
  const nextClue = !isCorrect && attempt < clues.length ? clues[attempt] : null;
  const gameOver = attempt >= 3 && !isCorrect;

  let feedbackMessage = null;
  if (!isCorrect) {
    if (bestMatch && bestMatch.score <= 0.75) {
      feedbackMessage = hasEnoughEssentials
        ? "💡 That’s close! Try again."
        : "💡 You’re close, but missing a key word.";
    } else {
      const defaultMessages = [
        "Try again!",
        "Keep going!",
        "Not quite — guess again!",
        "Think deeper!",
      ];
      feedbackMessage = defaultMessages[attempt] || "Not quite — try again!";
    }
  }

  return res.status(200).json({
    correct: isCorrect,
    nextClue,
    gameOver,
    feedbackMessage,
  });
}
