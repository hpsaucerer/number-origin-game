// pages/api/redeem-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_id } = req.body;

  console.log("💬 redeem-token body:", req.body);

  if (!device_id) {
    console.warn("🚫 Missing device_id in request body");
    return res.status(400).json({ error: "Missing device_id" });
  }

  // 🔍 Log before querying
  console.log("🔍 About to search for token with device_id:", device_id);

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

  // 🔍 Show what Supabase returned
  console.log("🔍 Supabase returned tokens:", tokens);

  if (!tokens || tokens.length === 0) {
    console.warn("🚫 No unused tokens found for device:", device_id);
    return res.status(403).json({ error: "No unused tokens found" });
  }

  const token = tokens[0];
  console.log("✅ Token to redeem:", token);

  const { error: updateError } = await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      puzzle_id: puzzle_id ? Number(puzzle_id) : null,
    })
    .eq("id", token.id);

  if (updateError) {
    console.error("❌ Failed to update token:", updateError.message);
    return res.status(500).json({ error: "Failed to redeem token: " + updateError.message });
  }

  console.log("✅ Token marked as used:", token.id);
  return res.status(200).json({ success: true, token_id: token.id });
}
