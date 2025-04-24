import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("puzzles")
    .select("id, number, formatted, category, clues, answer, fun_fact, date, reveal_formatted_at")
    .order("date", { ascending: true });

  if (error) {
    console.error("❌ Failed to fetch puzzles:", error.message);
    return res.status(500).json({ error: "Failed to fetch puzzles" });
  }

  res.status(200).json(
    data.map((puzzle) => ({
      ...puzzle,
      revealFormattedAt: puzzle.reveal_formatted_at,
    }))
  );
}
