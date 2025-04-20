import { supabase } from "@/lib/supabase";

export async function fetchTodayPuzzle() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("date", today)
    .single();

  if (error) {
    console.error("Error fetching today's puzzle:", error.message);
    return null;
  }

  return data;
}
