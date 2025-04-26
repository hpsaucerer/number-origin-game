// pages/api/today.js
import { supabase } from "@/lib/supabase";

function getUKTodayDate() {
  const ukNow = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
  const date = new Date(ukNow);
  return date.toISOString().split("T")[0]; // e.g., "2025-04-27"
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const today = getUKTodayDate(); // ✅ Use UK date!

  const { data: puzzle, error } = await supabase
    .from("puzzles")
    .select("id, number, answer, acceptable_guesses, essential_keywords, keywords, formatted, category, clues, fun_fact, date, reveal_formatted_at")
    .eq("date", today)
    .single();

  if (error || !puzzle) {
    console.error("❌ Error fetching today’s puzzle:", error);
    return res.status(404).json({ error: "No puzzle found for today" });
  }

  const formattedPuzzle = {
    ...puzzle,
    revealFormattedAt: puzzle.reveal_formatted_at,
  };

  return res.status(200).json(formattedPuzzle);
}
