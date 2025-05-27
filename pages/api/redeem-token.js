import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { device_id, puzzle_id } = req.body;

    if (!device_id) {
      return res.status(400).json({ error: "Missing device_id" });
    }

    const normalizedId = device_id.trim().toLowerCase();
    console.log("🔍 Normalized device_id:", normalizedId);

    const { data: tokens, error: fetchError } = await supabase
      .from("ArchiveTokens")
      .select("*")
      .eq("device_id", normalizedId)
      .eq("used", false)
      .order("token_date", { ascending: true })
      .limit(1);

    if (fetchError) {
      console.error("❌ Supabase fetch error:", fetchError.message);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!tokens || tokens.length === 0) {
      console.warn("🚫 No unused tokens found for:", normalizedId);
      return res.status(403).json({ error: "No unused tokens found" });
    }

    const token = tokens[0];
    console.log("✅ Found token:", token.id);

    const { error: updateError } = await supabase
      .from("ArchiveTokens")
      .update({
        used: true,
        used_at: new Date().toISOString(),
        puzzle_id: puzzle_id ? Number(puzzle_id) : null,
      })
      .eq("id", token.id);

    if (updateError) {
      console.error("❌ Update failed:", updateError.message);
      return res.status(500).json({ error: "Token update failed" });
    }

    console.log("✅ Token marked used:", token.id);
    return res.status(200).json({ success: true, token_id: token.id });
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
