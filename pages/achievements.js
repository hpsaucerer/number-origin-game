// pages/achievements.js
"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/Footer";
import NumberHistoryWheel from "@/components/NumberHistoryWheel";
import { supabase } from "@/lib/supabase";    // ← make sure you export your supabase client

const ALL_CATEGORIES = [
  "Maths","Science","Culture","Geography","Sport","History",
];

export default function NumberVaultPage() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [history, setHistory] = useState([]);             // ← will hold { number, answer, fun_fact, category }
  const [loading, setLoading] = useState(true);

  // get the list of puzzle‐numbers the user has solved
  // (you might already be storing this in localStorage or in a separate table)
  // for demo, let’s assume `completedPuzzleNumbers` is in localStorage as an array of strings:
  useEffect(() => {
    const completed = JSON.parse(
      localStorage.getItem("completedPuzzles") || "[]"
    );
    if (completed.length === 0) {
      setLoading(false);
      return;
    }

    supabase
      .from("puzzles")
      .select("number, answer, fun_fact, category")
      .in("number", completed)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setHistory(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // build your categoryCounts from `history`
  const categoryCounts = useMemo(() => {
    const counts = ALL_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {});
    history.forEach((p) => {
      if (counts[p.category] != null) counts[p.category]++;
    });
    return counts;
  }, [history]);

  const totalSolved = history.length;

  // filter for the wheel
  const filtered = useMemo(() => {
    if (filterCategory === "All") return history;
    return history.filter((p) => p.category === filterCategory);
  }, [filterCategory, history]);

  return (
    <>
      <Header />

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        {/* … your responsive header/blurb here … */}

        {/* ─── Clickable Category Tiles ─── */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <div
              key={cat}
              role="button"
              onClick={() =>
                setFilterCategory((cur) => (cur === cat ? "All" : cat))
              }
              className={`
                cursor-pointer bg-white p-4 rounded-lg shadow text-center
                ${filterCategory === cat && "ring-2 ring-blue-500"}
              `}
            >
              <p className="text-2xl font-bold">{categoryCounts[cat]}</p>
              <p className="text-sm text-gray-500">{cat}</p>
            </div>
          ))}
        </div>

        {/* ─── Puzzle History Wheel ─── */}
        {loading ? (
          <p className="text-center">Loading your vault…</p>
        ) : (
          <NumberHistoryWheel history={filtered} />
        )}
      </main>

      <Footer />
    </>
  );
}
