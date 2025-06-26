// pages/achievements.js
'use client';

import { useState, useMemo } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/Footer";
import NumberHistoryWheel from "@/components/NumberHistoryWheel";

const PUZZLE_HISTORY = [
  { number: "480", fact: "Battle of Thermopylae", category: "History" },
  { number: "357", fact: "Mirrors inside the Galerie de Glaces at Versailles", category: "Culture" },
  { number: "206", fact: "Number of bones in the human body", category: "Science" },
  { number: "73",  fact: "Sheldon Cooper’s ‘best number’", category: "Culture" },
  { number: "23",  fact: "Stab wounds inflicted upon Julius Caesar", category: "History" },
  { number: "9.58",fact: "Men’s 100m record set by Usain Bolt", category: "Sport" },
  // …and so on, pull from localStorage or your API
];

export default function AchievementsPage() {
  const [filterCategory, setFilterCategory] = useState("All");

  // derive unique categories
  const categories = useMemo(() => {
    const cats = PUZZLE_HISTORY.map(p => p.category);
    return ["All", ...Array.from(new Set(cats))];
  }, []);

  // apply filter
  const filtered = useMemo(() => {
    return filterCategory === "All"
      ? PUZZLE_HISTORY
      : PUZZLE_HISTORY.filter(p => p.category === filterCategory);
  }, [filterCategory]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Your Achievements & Puzzle History
        </h1>

        {/* filter + total count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <label htmlFor="category-filter" className="mr-2 text-sm font-medium">
              Category:
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600">
            {filtered.length} puzzle{filtered.length !== 1 && "s"} solved
          </p>
        </div>

        {/* wheel */}
        <section className="mb-12">
          <NumberHistoryWheel history={filtered} />
        </section>

        {/* placeholder for trophies */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Trophies & Badges</h2>
          <p className="text-gray-600">
            Coming soon: your earned medals, streak info, etc.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
