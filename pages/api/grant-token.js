// pages/api/grant-token.js
import { supabase } from "@/lib/supabase";

export const config = {
  api: {
    bodyParser: true, // Ensure body parsing is enabled (usually by default)
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let device_id = null;
  let source = "manual_grant";

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    device_id = body.device_id;
    source = body.source || source;
  } catch (err) {
    console.error("❌ Failed to parse JSON body:", err.message);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  console.log("🛠️ Grant token for device:", device_id, "via source:", source);

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

  const { data, error: insertError } = await supabase.from("ArchiveTokens").insert([
    {
      device_id,
      used: false,
      token_date: new Date().toISOString().split("T")[0],
      source,
    },
  ]);

  if (insertError) {
    console.error("❌ Failed to insert new token:", insertError.message);
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(200).json({ success: true, token_id: data[0].id });
}
