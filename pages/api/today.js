// pages/api/today.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: puzzle, error } = await supabase
    .from("puzzles")
    .select("id, number, answer, acceptable_guesses, essential_keywords, keywords, formatted, category, clues, fun_fact, date, reveal_formatted_at")
    .eq("date", today)
    .single();

  if (error || !puzzle) {
    console.error("❌ Error fetching today’s puzzle:", error);
    return res.status(404).json({ error: "No puzzle found for today" });
  }

  // ✅ Remap to match frontend field expectations
  const formattedPuzzle = {
    ...puzzle,
    revealFormattedAt: puzzle.reveal_formatted_at,
  };

  return res.status(200).json(formattedPuzzle);
}
