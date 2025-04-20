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

  // ✅ Map reveal_formatted_at to revealFormattedAt
  const formattedData = {
    ...data,
    revealFormattedAt: data.reveal_formatted_at,
  };

  console.log("✅ Today's puzzle fetched from Supabase:", formattedData);
  return formattedData;
}

export async function fetchAllPuzzles() {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("❌ Error fetching all puzzles:", error.message);
    return [];
  }

  // ✅ Map reveal_formatted_at for each puzzle
  const formattedPuzzles = data.map((puzzle) => ({
    ...puzzle,
    revealFormattedAt: puzzle.reveal_formatted_at,
  }));

  console.log("✅ All puzzles fetched from Supabase:", formattedPuzzles);
  return formattedPuzzles;
}
