import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { device_id, puzzle_id } = req.body;

  if (!device_id || !puzzle_id) {
    return res.status(400).json({ error: "Missing device_id or puzzle_id" });
  }

  try {
    const { data, error } = await supabase
      .from("ArchiveTokens")
      .select("*")
      .eq("device_id", device_id)
      .eq("used", false);

    if (error) {
      console.error("🔴 Supabase query error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.warn("🚫 No unused token found for this device.");
      return res.status(403).json({ error: "No valid token" });
    }

    const token = data[0];

    const { error: updateError } = await supabase
      .from("ArchiveTokens")
      .update({ used: true, used_at: new Date().toISOString() })
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

