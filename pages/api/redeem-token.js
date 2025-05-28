// pages/api/redeem-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { device_id, puzzle_number } = req.body;

  if (!device_id || typeof puzzle_number !== "number") {
    return res.status(400).json({ success: false, error: "Missing device_id or puzzle_number" });
  }

  const { data: token, error } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id)
    .eq("used", false)
    .maybeSingle();

  if (error || !token) {
    return res.status(404).json({ success: false, error: "No valid token found" });
  }

  const { error: updateError } = await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      puzzle_number,
    })
    .eq("id", token.id);

  if (updateError) {
    return res.status(500).json({ success: false, error: "Token update failed" });
  }

  return res.status(200).json({ success: true });
}
