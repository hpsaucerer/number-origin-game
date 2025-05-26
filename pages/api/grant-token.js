// pages/api/grant-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, source = "manual_grant" } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  console.log("🛠️ Grant token for device:", device_id, "via source:", source);

  // Check if there's already an unused token for this device
  const { data: existing, error: checkError } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id)
    .eq("used", false)
    .limit(1);

  if (checkError) {
    console.error("❌ Error checking existing token:", checkError.message);
    return res.status(500).json({ error: checkError.message });
  }

  if (existing && existing.length > 0) {
    console.log("✅ Reusing existing unused token:", existing[0].id);
    return res.status(200).json({ success: true, token_id: existing[0].id });
  }

  // Insert a new token if none exist
  const { data, error: insertError } = await supabase
    .from("ArchiveTokens")
    .insert([
      {
        device_id,
        used: false,
        token_date: new Date().toISOString().split("T")[0],
        source,
      },
    ])
    .select(); // Ensure inserted data is returned

  if (insertError) {
    console.error("❌ Failed to insert new token:", insertError.message);
    return res.status(500).json({ error: insertError.message });
  }

  if (!data || data.length === 0) {
    console.error("❌ Insert succeeded but no data returned.");
    return res.status(500).json({ error: "No data returned after insert" });
  }

  return res.status(200).json({ success: true, token_id: data[0].id });
}
