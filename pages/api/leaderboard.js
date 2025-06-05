import { supabase } from "@/lib/supabase";

// 👇 Helper to calculate week start (Sunday)
function getWeekStart(dateStr) {
  const d = new Date(dateStr);
  const day = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().split("T")[0]; // returns YYYY-MM-DD
}

// 👇 Helper to compute score
function calculateScore(guessCount, timeTakenSec) {
  let guessScore = 0;
  if (guessCount === 1) guessScore = 50;
  else if (guessCount === 2) guessScore = 30;
  else if (guessCount === 3) guessScore = 20;
  else if (guessCount === 4) guessScore = 10;

  let timeScore = 0;
  if (timeTakenSec <= 100) timeScore = 100;
  else if (timeTakenSec <= 200) timeScore = 70;
  else if (timeTakenSec <= 300) timeScore = 50;
  else if (timeTakenSec <= 600) timeScore = 30;
  else timeScore = 10;

  return guessScore + timeScore;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { device_id, puzzle_id, attempts, is_correct, name, time_taken_sec } = req.body;

  if (!device_id || !puzzle_id || !name || attempts === undefined || is_correct === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const formattedDate = new Date(puzzle_id).toISOString().split("T")[0];
  const weekStart = getWeekStart(formattedDate);

  // Check for duplicate
  const { data: existing, error: fetchError } = await supabase
    .from("leaderboard_entries")
    .select("*")
    .eq("device_id", device_id)
    .eq("puzzle_date", formattedDate)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Supabase fetch error:", fetchError);
    return res.status(500).json({ message: "Database fetch failed", error: fetchError });
  }

  if (existing) {
    return res.status(200).json({ message: "Already submitted" });
  }

  const score = calculateScore(attempts, time_taken_sec ?? 9999);

  const { error } = await supabase.from("leaderboard_entries").insert([
    {
      device_id,
      puzzle_date: formattedDate,
      week_start: weekStart,
      guess_count: attempts,
      is_correct,
      nickname: name,
      time_taken_sec: time_taken_sec ?? null,
      score,
    },
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return res.status(500).json({ message: "Insert failed", error });
  }

  return res.status(200).json({ success: true });
}
