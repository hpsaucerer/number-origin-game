// pages/api/redeem-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_id } = req.body;

  console.log("💬 redeem-token body:", req.body); // 👈 Log 1

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
    return res.status(500).json({ error: "Supabase error: " + fetchError.message });
  }
  
  console.log("🧪 Token lookup result:", tokens);

  if (!tokens || tokens.length === 0) {
    return res.status(403).json({ error: "No unused tokens found" });
  }

  const token = tokens[0];
  console.log("✅ token to redeem:", token); // 👈 Log 2

  const { error: updateError } = await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      puzzle_id: puzzle_id ? Number(puzzle_id) : null // 🛠 Ensure number type
    })
    .eq("id", token.id);

  if (updateError) {
    console.error("❌ Failed to update token:", updateError.message); // 👈 Log 3
    return res.status(500).json({ error: "Failed to redeem token: " + updateError.message });
  } else {
    console.log("✅ Token marked as used:", token.id); // 👈 Log 4
  }

  return res.status(200).json({ success: true, token_id: token.id });
}

