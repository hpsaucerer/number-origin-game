import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_id } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  const normalizedId = device_id.trim().toLowerCase();

  console.log("💬 redeem-token body:", req.body);
  console.log("🔎 Checking token for device_id:", normalizedId);

const normalizedDeviceId = device_id?.trim().toLowerCase();
console.log("🔍 Normalized device_id:", normalizedDeviceId);

const { data: tokens, error: fetchError } = await supabase
  .from("ArchiveTokens")
  .select("*")
  .filter("device_id", "eq", normalizedDeviceId)
  .eq("used", false)
  .order("token_date", { ascending: true })
  .limit(1);

  if (fetchError) {
    return res.status(500).json({ error: "Supabase error: " + fetchError.message });
  }

  console.log("🔍 Matching tokens from Supabase:", tokens);

  if (!tokens || tokens.length === 0) {
    console.warn("🚫 No tokens found for device:", normalizedId);
    return res.status(403).json({ error: "No unused tokens found" });
  }

  const token = tokens[0];
  console.log("✅ token to redeem:", token);

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
