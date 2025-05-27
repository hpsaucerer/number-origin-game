// pages/api/redeem-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let { device_id, puzzle_id } = req.body;

  // ✂️ Trim to sanitize input
  if (typeof device_id === "string") {
    device_id = device_id.trim();
  }

  console.log("💬 redeem-token sanitized body:", { device_id, puzzle_id });

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  const { data: tokens, error: fetchError } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id)
    .eq("used", false)
    .order("token_date", { ascending: true })
    .limit(1);

  if (fetchError) {
    console.error("❌ Supabase fetch error:", fetchError.message);
    return res.status(500).json({ error: "Supabase error: " + fetchError.message });
  }

  if (!tokens || tokens.length === 0) {
    console.warn("🚫 No valid tokens found for device:", device_id);
    return res.status(403).json({ error: "No unused tokens found" });
  }

  const token = tokens[0];
  console.log("✅ Token selected for redemption:", token);

  const { error: updateError } = await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      puzzle_id: puzzle_id ? Number(puzzle_id) : null
    })
    .eq("id", token.id);

  if (updateError) {
    console.error("❌ Token update failed:", updateError.message);
    return res.status(500).json({ error: "Failed to redeem token: " + updateError.message });
  }

  console.log("✅ Token successfully redeemed:", token.id);
  return res.status(200).json({ success: true, token_id: token.id });
}
