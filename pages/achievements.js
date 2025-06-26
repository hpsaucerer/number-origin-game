// pages/achievements.js
"use client";

import { useState, useMemo } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/Footer";
import NumberHistoryWheel from "@/components/NumberHistoryWheel";

// replace this with your real solved-history source
const PUZZLE_HISTORY = [
  { number: "480", fact: "Battle of Thermopylae", category: "History" },
  { number: "357", fact: "Mirrors in the Galerie de Glaces", category: "Culture" },
  { number: "206", fact: "Number of bones in the human body", category: "Science" },
  { number: "73",  fact: "Sheldon Cooper’s favourite number", category: "Culture" },
  { number: "23",  fact: "Stab wounds on Julius Caesar", category: "History" },
  { number: "9.58",fact: "Usain Bolt’s 100m record", category: "Sport" },
];

const ALL_CATEGORIES = [
  "Maths",
  "Science",
  "Culture",
  "Geography",
  "Sport",
  "History",
];

export default function NumberVaultPage() {
  // “All” means no filter
  const [filterCategory, setFilterCategory] = useState("All");

  // precompute counts per category
  const categoryCounts = useMemo(() => {
    const counts = ALL_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {});
    PUZZLE_HISTORY.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, []);

  const totalSolved = PUZZLE_HISTORY.length;

  // apply filter (if “All”, show everything)
  const filtered = useMemo(() => {
    if (filterCategory === "All") return PUZZLE_HISTORY;
    return PUZZLE_HISTORY.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  return (
    <>
      <Header />

      <main className="max-w-3xl mx-auto p-6 space-y-8">

        {/* Title + Blurb + Total */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Number Vault</h1>
          <p className="text-gray-600">
            Welcome to your vault of solved puzzles. Scroll through every number you’ve unlocked, filter by tapping a category below, and revisit any fun fact at will.
          </p>
          <p className="text-lg font-semibold">
            Total puzzles solved:{" "}
            <span className="text-blue-600">{totalSolved}</span>
          </p>
        </div>

        {/* ── Clickable Category Bar ── */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {ALL_CATEGORIES.map((cat) => (
            <div
              key={cat}
              role="button"
              onClick={() =>
                setFilterCategory((current) =>
                  current === cat ? "All" : cat
                )
              }
              className={`
                cursor-pointer 
                bg-white p-4 rounded-lg shadow text-center
                ${filterCategory === cat ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <p className="text-2xl font-bold">{categoryCounts[cat]}</p>
              <p className="text-sm text-gray-500">{cat}</p>
            </div>
          ))}
        </div>

        {/* ── Number Wheel ── */}
        <section>
          <NumberHistoryWheel history={filtered} />
        </section>
      </main>

      <Footer />
    </>
  );
}
