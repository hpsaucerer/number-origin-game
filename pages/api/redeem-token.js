import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_id, puzzle_number } = req.body;

  if (!device_id || (!puzzle_id && puzzle_number === undefined)) {
    return res.status(400).json({ error: "Missing device_id or puzzle identifier" });
  }

  let resolvedPuzzleId = puzzle_id;

  // 🔍 If puzzle_number is given, resolve to puzzle_id
  if (!resolvedPuzzleId && puzzle_number !== undefined) {
    const { data, error } = await supabase
      .from("puzzles")
      .select("id")
      .eq("puzzle_number", puzzle_number)
      .single();

    if (error || !data) {
      console.error("❌ Couldn't resolve puzzle_number to puzzle_id:", error?.message);
      return res.status(400).json({ error: "Invalid puzzle_number" });
    }

    resolvedPuzzleId = data.id;
  }

  try {
    const { data, error } = await supabase
      .from("ArchiveTokens")
      .select("*")
      .eq("device_id", device_id)
      .eq("used", false)
      .is("puzzle_id", null) // only use tokens that haven't been assigned yet
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("🔴 Supabase query error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      console.warn("🚫 No unused token found for this device.");
      return res.status(403).json({ error: "No valid token" });
    }

    const token = data;

    const { error: updateError } = await supabase
      .from("ArchiveTokens")
      .update({
        used: true,
        used_at: new Date().toISOString(),
        puzzle_id: resolvedPuzzleId
      })
      .eq("id", token.id);

    if (updateError) {
      console.error("🔴 Failed to mark token as used:", updateError.message);
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ success: true, token_id: token.id });
  } catch (err) {
    console.error("❌ Unexpected error in redeem-token:", err.message);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
