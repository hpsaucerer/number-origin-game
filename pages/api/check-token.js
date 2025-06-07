import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_number } = req.body;

  const { data: tokens, error } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id.trim().toLowerCase())
    .eq("used", false);

  if (error) {
    console.error("❌ Supabase token check error:", error.message);
    return res.status(500).json({ valid: false });
  }

  const valid = tokens.some((token) => {
    // Token is reusable OR not tied to a puzzle yet
    return !token.puzzle_number || parseInt(token.puzzle_number) === parseInt(puzzle_number);
  });

  res.status(200).json({ valid });
}
