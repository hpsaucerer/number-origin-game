import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let device_id, source, puzzle_number;

  try {
    ({ device_id, source = "manual_grant", puzzle_number = null } = req.body || {});
  } catch (err) {
    console.error("❌ Error parsing JSON body:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  const normalizedId = device_id.trim().toLowerCase();

  console.log("🛠️ Grant token for device:", normalizedId, "via source:", source, "→ puzzle_number:", puzzle_number);

  try {
    const { data: existing, error: checkError } = await supabase
      .from("ArchiveTokens")
      .select("*")
      .eq("device_id", normalizedId)
      .eq("used", false)
      .limit(1);

    if (checkError) {
      throw new Error(`Supabase select error: ${checkError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log("✅ Reusing existing unused token:", existing[0].id);
      return res.status(200).json({ success: true, token_id: existing[0].id });
    }

    const { data: insertData, error: insertError } = await supabase
      .from("ArchiveTokens")
      .insert([
        {
          device_id: normalizedId,
          used: false,
          used_at: null,
          puzzle_number: null,
          puzzle_number: puzzle_number ? parseInt(puzzle_number) : null,
          token_date: new Date().toISOString().split("T")[0],
          source,
        },
      ])
      .select();

    if (insertError) {
      throw new Error(`Supabase insert error: ${insertError.message}`);
    }

    if (!insertData || insertData.length === 0) {
      throw new Error("Insert succeeded but no data returned.");
    }

    return res.status(200).json({ success: true, token_id: insertData[0].id });
  } catch (err) {
    console.error("❌ Internal server error in grant-token:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
