import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_number } = req.body;

  const { data: token, error } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id.trim().toLowerCase())
    .eq("used", false)
    .maybeSingle();

  const valid =
    token &&
    (!token.puzzle_number || parseInt(token.puzzle_number) === parseInt(puzzle_number));

  res.status(200).json({ valid });
}
