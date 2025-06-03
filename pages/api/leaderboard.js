// pages/api/leaderboard.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { device_id, puzzle_id, attempts, is_correct, name } = req.body;

  if (!device_id || !puzzle_id || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Prevent duplicate submissions for the same puzzle by device
  const { data: existing, error: fetchError } = await supabase
    .from("leaderboard_entries") // ✅ updated
    .select("*")
    .eq("device_id", device_id)
    .eq("puzzle_date", puzzle_id) // ✅ updated key to match schema
    .single();

  if (existing) {
    return res.status(200).json({ message: "Already submitted" });
  }

  const { error } = await supabase.from("leaderboard_entries").insert([
    {
      device_id,
      puzzle_date: puzzle_id, // ✅ column name must match Supabase table
      guess_count: attempts,
      is_correct,
      nickname: name, // ✅ column name must match Supabase table
    },
  ]);

  if (error) {
    return res.status(500).json({ message: "Database insert failed", error });
  }

  return res.status(200).json({ success: true });
}
