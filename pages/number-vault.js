// pages/number-vault.js
"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/Footer";
import NumberHistoryWheel from "@/components/NumberHistoryWheel";
import { supabase } from "@/lib/supabase";
import { getCompletedDatesFromLocalStorage } from "@/lib/progress";

const ALL_CATEGORIES = [
  "Maths",
  "Science",
  "Culture",
  "Geography",
  "Sport",
  "History",
];

export default function NumberVaultPage() {
  const [history, setHistory] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    async function loadHistory() {
      // 1) read sanitized completion dates (removes bad completed-* keys)
const dates = getCompletedDatesFromLocalStorage();

if (dates.length === 0) {
  setHistory([]);
  return;
}

      // 2) try to fetch only those rows by date
      let rows = [];
      try {
        const { data, error } = await supabase
          .from("puzzles")
          .select("number, formatted, answer, fun_fact, category, date")
          .in("date", dates);

        if (error) throw error;
        rows = data;
      } catch (err) {
        console.warn(
          "Supabase .in('date',…) failed (Edge?), falling back to full fetch:",
          err
        );
        // fallback: fetch all and filter client-side
        const { data: all, error: allErr } = await supabase
          .from("puzzles")
          .select("number, formatted, answer, fun_fact, category, date");
        if (allErr) {
          console.error("Full‐table fetch also failed:", allErr);
          setHistory([]);
          return;
        }
        rows = all.filter((p) => dates.includes(p.date));
      }

      // 3) shape it for the wheel
      setHistory(
        rows.map((p) => ({
          number:    p.number,
          formatted: p.formatted,
          answer:    p.answer,
          funFact:   p.fun_fact,
          category:  p.category,
          date:      p.date,
        }))
      );
    }

    loadHistory();
  }, []);

  // count per category
  const categoryCounts = useMemo(() => {
    const acc = ALL_CATEGORIES.reduce((o, c) => ({ ...o, [c]: 0 }), {});
    history.forEach((p) => {
      if (acc[p.category] != null) acc[p.category]++;
    });
    return acc;
  }, [history]);

  // filter the wheel
  const filtered = useMemo(() => {
    return filterCategory === "All"
      ? history
      : history.filter((p) => p.category === filterCategory);
  }, [history, filterCategory]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-8 pb-12 space-y-8">
        {/* Heading + Blurb + Total */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Number Vault</h1>
          <p className="text-gray-600">
            Scroll through the numbers you’ve unlocked and revisit any Nugget of
            Knowledge™ at will. Tap the tiles below to filter the numbers by
            category.
          </p>
          <p className="text-lg font-semibold">
            Total puzzles solved:{" "}
            <span className="text-blue-600">{history.length}</span>
          </p>
        </div>

        {/* Category Tiles */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {ALL_CATEGORIES.map((cat) => (
            <div
              key={cat}
              role="button"
              onClick={() =>
                setFilterCategory((cur) => (cur === cat ? "All" : cat))
              }
              className={`cursor-pointer bg-white p-4 rounded-lg shadow text-center transition ${
                filterCategory === cat
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-md"
              }`}
            >
              <p className="text-2xl font-bold">{categoryCounts[cat] || 0}</p>
              <p className="text-sm text-gray-500">{cat}</p>
            </div>
          ))}
        </div>

        {/* Wheel or Empty */}
        {history.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven’t solved any puzzles yet. Complete one to see it here!
          </p>
        ) : (
          <NumberHistoryWheel history={filtered} />
        )}
      </main>
      <Footer />
    </>
  );
}
