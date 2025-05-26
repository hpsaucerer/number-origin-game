// pages/api/grant-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, source } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  // Optional: Prevent granting multiple tokens
  const { data: existing, error: fetchError } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id)
    .eq("source", source || "first_game_bonus");

  if (fetchError) {
    return res.status(500).json({ error: fetchError.message });
  }

  if (existing && existing.length > 0) {
    return res.status(409).json({ error: "Token already granted" });
  }

  const { error: insertError } = await supabase.from("ArchiveTokens").insert({
    device_id,
    token_date: new Date().toISOString(),
    used: false,
    source: source || "first_game_bonus",
  });

  if (insertError) {
    return res.status(500).json({ error: "Failed to grant token: " + insertError.message });
  }

  return res.status(200).json({ success: true });
}
