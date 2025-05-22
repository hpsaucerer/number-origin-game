import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("puzzles")
    .select("id, puzzle_number, number, answer, acceptable_guesses, essential_keywords, keywords, formatted, category, clues, fun_fact, date, reveal_formatted_at, conflicts, min_guess_words, min_essential_keywords")
    .order("date", { ascending: true });

  if (error) {
    console.error("❌ Failed to fetch puzzles:", error.message);
    return res.status(500).json({ error: "Failed to fetch puzzles" });
  }

res.status(200).json(
  data.map((p) => ({
    id: p.id,
    number: p.number,
    formatted: p.formatted,
    revealFormattedAt: p.reveal_formatted_at,
    answer: p.answer,
    clues: p.clues,
    funfact: p.fun_fact,
    keywords: p.keywords,
    essentialKeywords: p.essential_keywords,
    acceptableGuesses: p.acceptable_guesses,
    category: p.category,
    date: p.date,
    conflicts: p.conflicts,
    minGuessWords: p.min_guess_words,
    minEssentialKeywords: p.min_essential_keywords,
  }))
);
