import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  const trimmedId = deviceId.trim();
  console.log("📦 Incoming trimmed deviceId:", JSON.stringify(trimmedId));

  // 🔍 Find matching token
  const { data: tokenRow, error } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .ilike("device_id", trimmedId)  // case-insensitive match
    .eq("used", false)
    .eq("token_date", new Date().toISOString().split("T")[0])
    .limit(1)
    .single();

  if (error || !tokenRow) {
    console.error("❌ No valid archive token found for:", trimmedId, error);
    return res.status(403).json({ error: "No valid archive token found" });
  }

  const { error: updateError } = await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
    })
    .eq("id", tokenRow.id);

  if (updateError) {
    console.error("❌ Failed to mark token as used:", updateError);
    return res.status(500).json({ error: "Failed to mark token as used" });
  }

  return res.status(200).json({ success: true });
}
