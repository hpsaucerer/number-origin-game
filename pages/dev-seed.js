// pages/dev-seed.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ALL_CATEGORIES } from "@/lib/progress";

const SECRET = process.env.NEXT_PUBLIC_DEV_SEED_SECRET || "";
const ENV = process.env.NEXT_PUBLIC_VERCEL_ENV || "production"; // "development" | "preview" | "production"

export default function DevSeed() {
  const [allowed, setAllowed] = useState(false);
  const [category, setCategory] = useState(ALL_CATEGORIES[0]);
  const [count, setCount] = useState(19);
  const [log, setLog] = useState([]);

  useEffect(() => {
    // Block in production, always.
    if (ENV === "production") {
      setAllowed(false);
      return;
    }
    // In preview/dev:
    // - if a secret is set, require it in the URL
    // - if no secret is set, allow automatically (preview/dev only)
    const qp = new URLSearchParams(window.location.search);
    const okWhenSecret = SECRET && qp.get("secret") === SECRET;
    const okWhenNoSecret = !SECRET;
    setAllowed(okWhenSecret || okWhenNoSecret);
  }, []);

  const addLog = (msg) =>
    setLog((L) => [`${new Date().toLocaleTimeString()} ${msg}`, ...L]);

  if (ENV === "production") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Dev Seed</h2>
        <p>Disabled in production.</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Dev Seed</h2>
        <p>
          A secret is required. Open with <code>?secret=YOUR_SECRET</code>.
        </p>
      </div>
    );
  }

  async function seedCategory() {
    try {
      addLog(`Seeding ${count} completions for ${category}…`);

      // Fetch *all* dates for the category (ordered). We’ll de-dupe client-side.
      const { data, error } = await supabase
        .from("puzzles")
        .select("date,category")
        .eq("category", category)
        .order("date", { ascending: true });

      if (error) throw error;

      const allDates = (data || []).map((r) => r.date).filter(Boolean);

      // Build a list of UNIQUE dates up to the requested count
      const uniqueDates = [];
      const seen = new Set();
      for (const d of allDates) {
        if (!seen.has(d)) {
          seen.add(d);
          uniqueDates.push(d);
          if (uniqueDates.length >= count) break;
        }
      }

      // Write only unique completed-* keys
      uniqueDates.forEach((d) => {
        localStorage.setItem(`completed-${d}`, "true");
      });

      const totalUniqueInDb = new Set(allDates).size;
      const dupSkipped = allDates.length - totalUniqueInDb;

      addLog(
        `✅ Wrote ${uniqueDates.length} unique completed-* keys for ${category}.` +
          (dupSkipped > 0 ? ` Skipped ${dupSkipped} duplicate date(s) from DB.` : "") +
          (uniqueDates.length < count
            ? ` Note: only ${totalUniqueInDb} unique dates exist for this category.`
            : "")
      );
    } catch (e) {
      addLog(`❌ ${e?.message || e}`);
    }
  }

  function clearCompleted() {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("completed-")) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
    addLog(`🧹 Removed ${toRemove.length} completed-* keys.`);
  }

  function resetTrophiesAndTiles() {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("trophyTier:") || k.startsWith("tile-earned-")) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("earnedTileIndexes");
    localStorage.removeItem("firstTokenGranted");
    addLog(`🔁 Reset trophies/tiles (${toRemove.length} keys).`);
  }

  function setTiles(n = 7) {
    const arr = Array.from({ length: Math.max(0, Math.min(7, n)) }, (_, i) => i);
    localStorage.setItem("earnedTileIndexes", JSON.stringify(arr));
    addLog(`🧩 Set earnedTileIndexes to length ${arr.length}.`);
  }

  function setPlayerName() {
    const name = prompt(
      "Enter a test leaderboard name:",
      localStorage.getItem("playerName") || "Tester"
    );
    if (name) {
      localStorage.setItem("playerName", name.trim());
      addLog(`👤 Set playerName = ${name.trim()}`);
    }
  }

  function clearAllLocal() {
    localStorage.clear();
    addLog("🔥 localStorage cleared.");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto" }}>
      <h2>Dev Seed (Preview/Dev)</h2>
      {!SECRET && (
        <p style={{ color: "#a15" }}>
          Running <b>without</b> a secret. Anyone with this preview URL can access this page.
          (Safe for you, since it only writes localStorage.)
        </p>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          Category:&nbsp;
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Count:&nbsp;
          <input
            type="number"
            value={count}
            min={0}
            max={200}
            onChange={(e) => setCount(parseInt(e.target.value || "0", 10))}
            style={{ width: 80 }}
          />
        </label>

        <button onClick={seedCategory}>Seed completions</button>
        <button onClick={() => { setCount(19); seedCategory(); }}>
          Seed 19 for today’s badge
        </button>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setTiles(7)}>Give 7 tiles</button>
        <button onClick={resetTrophiesAndTiles}>Reset trophies/tiles</button>
        <button onClick={clearCompleted}>Clear completed-* keys</button>
        <button onClick={setPlayerName}>Set player name</button>
        <button onClick={clearAllLocal}>Clear ALL localStorage</button>
      </div>

      <div style={{ marginTop: 18 }}>
        <h4>Log</h4>
        <pre style={{ background: "#f7f7f7", padding: 12, maxHeight: 300, overflow: "auto", border: "1px solid #eee", borderRadius: 8 }}>
{log.join("\n")}
        </pre>
      </div>
    </div>
  );
}
