import { supabase } from "@/lib/supabase"; // adjust if needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  console.log("Incoming deviceId:", deviceId);

  // 🔍 Find an unused token for this device
  const { data: tokenRow, error } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", deviceId)
    .eq("used", false)
    .limit(1)
    .single();

  if (error || !tokenRow) {
    return res.status(403).json({ error: "No valid archive token found" });
  }

  // ✅ Mark token as used, with added error logging
  const { error: updateError } = await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
    })
    .eq("id", tokenRow.id);

  if (updateError) {
    console.error("Failed to mark token as used:", updateError);
    return res.status(500).json({ error: "Failed to mark token as used" });
  }

  return res.status(200).json({ success: true });
}
