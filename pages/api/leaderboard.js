// pages/api/leaderboard.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { device_id, puzzle_id, attempts, is_correct, name } = req.body;

  if (!device_id || !puzzle_id || !name || attempts === undefined || is_correct === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const formattedDate = new Date(puzzle_id).toISOString().split("T")[0];

  // Prevent duplicate submissions for the same puzzle by device
  const { data: existing, error: fetchError } = await supabase
    .from("leaderboard_entries")
    .select("*")
    .eq("device_id", device_id)
    .eq("puzzle_date", formattedDate)
    .maybeSingle()

  if (fetchError) {
    console.error("❌ Supabase fetch error:", fetchError);
    return res.status(500).json({ message: "Database fetch failed", error: fetchError });
  }

  if (existing) {
    return res.status(200).json({ message: "Already submitted" });
  }

  const { error } = await supabase.from("leaderboard_entries").insert([
    {
      device_id,
      puzzle_date: formattedDate,
      guess_count: attempts,
      is_correct,
      nickname: name,
    },
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return res.status(500).json({ message: "Database insert failed", error });
  }

  return res.status(200).json({ success: true });
}
