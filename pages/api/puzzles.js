// pages/api/puzzles.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching puzzles:", error);
    return res.status(500).json({ error: "Failed to fetch puzzles" });
  }

  res.status(200).json(data);
}
