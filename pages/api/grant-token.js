// pages/api/grant-token.js
// Grants tokens. Now supports bulk Archive Tokens via: { kind: "archive", amount: N }.
// For archive grants we DO NOT "reuse" — we INSERT new rows into ArchiveTokens.
// Legacy callers (no kind) keep the previous behavior: reuse or insert a single token.

import { supabase } from "@/lib/supabase";
// NOTE: If RLS ever blocks these inserts in production, swap to a service client here:
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let device_id, source, puzzle_number, kind, amount;

  try {
    ({
      device_id,
      source = "manual_grant",
      puzzle_number = null,
      kind = "generic",        // <-- NEW: default to legacy behavior unless explicitly "archive"
      amount = 1,              // <-- NEW: number of tokens to grant (archive only)
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

  try {
    // ─────────────────────────────────────────────────────────────────────
    // ARCHIVE TOKENS: insert N rows into ArchiveTokens (no reuse)
    // ─────────────────────────────────────────────────────────────────────
    if (kind === "archive") {
      const amt = Math.max(1, Math.min(20, Number(amount) || 1));

      console.log(
        `🪙 Granting ${amt} ARCHIVE token(s) to ${normalizedId} via source: ${source}`
      );

      const rows = Array.from({ length: amt }, () => ({
        device_id: normalizedId,
        used: false,
        used_at: null,
        puzzle_number: puzzle_number ? parseInt(puzzle_number, 10) : null,
        token_date,
        source,
      }));

      const { error: insertError } = await supabase
        .from("ArchiveTokens")
        .insert(rows);

      if (insertError) {
        console.error("❌ Insert ArchiveTokens failed:", insertError);
        // Log failure for diagnostics
        await supabase.from("tokengrants").insert([{
          device_id: normalizedId,
          granted: false,
          token_date,
          source,
          note: `ERROR: Archive insert failed: ${insertError.message}`,
          kind: "archive",
          amount: amt,
        }]);
        return res.status(500).json({ error: "Failed to grant archive tokens" });
      }

      // Optional: mirror to tokengrants for auditing
      try {
        await supabase.from("tokengrants").insert([{
          device_id: normalizedId,
          granted: true,
          token_date,
          source,
          note: `Granted ${amt} archive token(s)`,
          kind: "archive",
          amount: amt,
        }]);
      } catch (e) {
        console.warn("tokengrants insert failed (non-fatal):", e?.message || e);
      }

      return res.status(200).json({ success: true, granted: amt, kind: "archive" });
    }

    // ─────────────────────────────────────────────────────────────────────
    // LEGACY / GENERIC TOKENS: keep your previous reuse-then-insert logic
    // (used by the first-time bonus etc.)
    // ─────────────────────────────────────────────────────────────────────

    console.log(
      "🛠️ Grant token for device:",
      normalizedId,
      "via source:",
      source,
      "→ puzzle_number:",
      puzzle_number
    );

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
      console.log("📝 Logging to tokengrants table...");

      await supabase.from("tokengrants").insert([{
        device_id: normalizedId,
        granted: false,   // not a *new* grant; we reused
        token_date,
        source,
        note: "Reused existing token",
        kind: "generic",
        amount: 0,
      }]);

      return res
        .status(200)
        .json({ success: true, token_id: existing[0].id, reused: true, granted: 0, kind: "generic" });
    }

    // No unused token exists → insert a single new one
    const { data: insertData, error: insertError } = await supabase
      .from("ArchiveTokens")
      .insert([{
        device_id: normalizedId,
        used: false,
        used_at: null,
        puzzle_number: puzzle_number ? parseInt(puzzle_number, 10) : null,
        token_date,
        source,
      }])
      .select();

    if (insertError) {
      throw new Error(`Supabase insert error: ${insertError.message}`);
    }
    if (!insertData || insertData.length === 0) {
      throw new Error("Insert succeeded but no data returned.");
    }

    console.log("📝 Logging to tokengrants table...");
    await supabase.from("tokengrants").insert([{
      device_id: normalizedId,
      granted: true,
      token_date,
      source,
      note: "New token granted (generic)",
      kind: "generic",
      amount: 1,
    }]);

    return res
      .status(200)
      .json({ success: true, token_id: insertData[0].id, reused: false, granted: 1, kind: "generic" });

  } catch (err) {
    console.error("❌ Internal server error in grant-token:", err?.message || err);

    console.log("📝 Logging to tokengrants table...");
    try {
      await supabase.from("tokengrants").insert([{
        device_id: device_id || "unknown",
        granted: false,
        token_date: new Date().toISOString().split("T")[0],
        source: source || "unknown",
        note: `ERROR: ${err?.message || err}`,
        kind,
        amount: Number(amount) || 1,
      }]);
    } catch (e) {
      // swallow
    }

    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
