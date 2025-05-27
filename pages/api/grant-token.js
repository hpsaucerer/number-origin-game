// pages/api/grant-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("📥 Incoming grant-token request:", req.body); // Debug input

  let device_id, source;

  try {
    ({ device_id, source = "manual_grant" } = req.body || {});

    if (typeof device_id !== "string" || !device_id.trim()) {
      return res.status(400).json({ error: "Invalid or missing device_id" });
    }

    // Normalize device_id
    device_id = device_id.trim().toLowerCase();
  } catch (err) {
    console.error("❌ Error parsing JSON body:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  console.log("🛠️ Grant token for device:", device_id, "via source:", source);

  try {
    // Check for existing unused token
    const { data: existing, error: checkError } = await supabase
      .from("ArchiveTokens")
      .select("*")
      .eq("device_id", device_id)
      .eq("used", false)
      .limit(1);

    if (checkError) {
      console.error("❌ Supabase select error:", checkError.message);
      throw new Error(`Supabase select error: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log("✅ Reusing existing unused token:", existing[0].id);
      return res.status(200).json({ success: true, token_id: existing[0].id });
    }

    // Insert new token
    const { data: insertData, error: insertError } = await supabase
      .from("ArchiveTokens")
      .insert([
        {
          device_id,
          used: false,
          token_date: new Date().toISOString().split("T")[0],
          source,
        },
      ])
      .select();

    if (insertError) {
      console.error("❌ Supabase insert error:", insertError.message);
      throw new Error(`Supabase insert error: ${insertError.message}`);
    }

    if (!insertData || insertData.length === 0) {
      throw new Error("Insert succeeded but no data returned.");
    }

    console.log("✅ Token granted and inserted with ID:", insertData[0].id);
    return res.status(200).json({ success: true, token_id: insertData[0].id });
  } catch (err) {
    console.error("❌ Internal server error in grant-token:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
