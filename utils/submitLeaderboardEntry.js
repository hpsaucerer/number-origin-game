import { supabase } from "../lib/supabase";

export async function submitLeaderboardEntry({ puzzleDate, deviceId, nickname, guessCount, isCorrect }) {
  const { data, error } = await supabase.from("leaderboard_entries").insert([
    {
      puzzle_date: puzzleDate,
      device_id: deviceId,
      nickname,
      guess_count: guessCount,
      is_correct: isCorrect,
    },
  ]);

  if (error) {
    console.error("Leaderboard submission error:", error.message);
  }

  return { data, error };
}
