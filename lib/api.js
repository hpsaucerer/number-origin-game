import { supabase } from "@/lib/supabase";

export async function fetchTodayPuzzle() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("date", today)
    .single();

  if (error) {
    console.error("❌ Error fetching today's puzzle:", error.message);
    return null;
  }

  console.log("✅ Today's puzzle fetched from Supabase:", data); // ✅ ADD THIS
  return data;
}

export async function fetchAllPuzzles() {
  const { data, error } = await supabase
    .from("puzzles")
    .select("id, number, formatted, answer, acceptable_Guesses, clues, funFact, date, keywords")
    .order("date", { ascending: true });

  if (error) {
    console.error("❌ Error fetching all puzzles:", error.message);
    return [];
  }

  console.log("✅ All puzzles fetched from Supabase:", data); // ✅ ADD THIS
  return data;
}
