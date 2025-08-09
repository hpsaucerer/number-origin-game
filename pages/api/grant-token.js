// pages/api/grant-token.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Parse + validate inputs
  // ──────────────────────────────────────────────────────────────────────────
  let device_id, source, puzzle_number, kind, amount;

  try {
    ({
      device_id,
      source = "manual_grant",
      puzzle_number = null,
      kind = "archive",
      amount = 1,
    } = req.body || {});
  } catch (err) {
    console.error("❌ Error parsing JSON body:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!device_id) {
    return res.status(400).json({ error: "Missing device_id" });
  }

  const normalizedId = String(device_id).trim().toLowerCase();
  const token_date = new Date().toISOString().split("T")[0];

  // clamp amount to sane bounds
  const amt = Math.max(1, Math.min(20, Number(amount) || 1));

  if (kind !== "archive") {
    // If you add other token “kinds” later, branch here.
    return res.status(400).json({ error: `Unsupported token kind: ${kind}` });
  }

  console.log(
    `🛠️ Grant ${amt} ${kind} token(s) for device: ${normalizedId} via source: ${source} → puzzle_number: ${puzzle_number}`
  );

  try {
    // ────────────────────────────────────────────────────────────────────────
    // Insert N archive tokens (NO reuse). Each is a separate row.
    // ────────────────────────────────────────────────────────────────────────
    const rows = Array.from({ length: amt }, () => ({
      device_id: normalizedId,
      used: false,
      used_at: null,
      puzzle_number: puzzle_number ? parseInt(puzzle_number, 10) : null,
      token_date,
      source,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("ArchiveTokens")
      .insert(rows)
      .select();

    if (insertError) {
      throw new Error(`Supabase insert error: ${insertError.message}`);
    }

    const granted = Array.isArray(inserted) ? inserted.length : 0;
    const token_ids = (inserted || []).map((r) => r.id);

    // Log one summary row in tokengrants
    try {
      await supabase.from("tokengrants").insert([
        {
          device_id: normalizedId,
          granted: true,
          token_date,
          source,
          note: `Granted ${granted} ${kind} token(s)`,
        },
      ]);
      console.log("📝 Logged grant to tokengrants.");
    } catch (e) {
      console.warn("tokengrants insert failed (non-fatal):", e.message);
    }

    return res.status(200).json({
      success: true,
      granted,
      token_ids,
    });
  } catch (err) {
    console.error("❌ Internal server error in grant-token:", err.message);

    // Try to log the failure as well (best-effort)
    try {
      await supabase.from("tokengrants").insert([
        {
          device_id: normalizedId,
          granted: false,
          token_date,
          source,
          note: `ERROR: ${err.message}`,
        },
      ]);
      console.log("📝 Logged failure to tokengrants.");
    } catch {
      /* ignore */
    }

    return res.status(500).json({ error: err.message });
  }
}
