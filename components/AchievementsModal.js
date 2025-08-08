// components/AchievementsModal.js
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  ALL_CATEGORIES,
  getCompletedDatesFromLocalStorage,
  nextTarget, // 🆕 dynamic target: 20 -> 50 -> 100
} from "@/lib/progress";

export default function AchievementsModal({ open, onClose }) {
  const TILE_WORD = "NUMERUS";
  const [earnedTileIndexes, setEarnedTileIndexes] = useState([]);
  const [categoryAchievements, setCategoryAchievements] = useState({});

  // simple color map (unchanged from your design)
  const COLOR_MAP = {
    Maths: "#3b82f6",
    Geography: "#63c4a7",
    Science: "#f57d45",
    History: "#f7c548",
    Culture: "#8e44ad",
    Sport: "#e53935",
  };

  useEffect(() => {
    if (!open) return;

    // -- Load earned tiles (safe parse) ----------------------------------
    try {
      const tiles = JSON.parse(localStorage.getItem("earnedTileIndexes") || "[]");
      setEarnedTileIndexes(Array.isArray(tiles) ? tiles : []);
    } catch (err) {
      console.error("Invalid earnedTileIndexes JSON:", err);
      setEarnedTileIndexes([]);
    }

    // -- Compute category counts (sanitized dates → Supabase) ------------
    (async () => {
      try {
        const dates = getCompletedDatesFromLocalStorage();

        if (dates.length === 0) {
          const zeros = ALL_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: 0 }), {});
          setCategoryAchievements(zeros);
          return;
        }

        let rows = [];
        const { data, error } = await supabase
          .from("puzzles")
          .select("category,date")
          .in("date", dates);

        if (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Supabase .in('date', …) failed; falling back:", error);
          }
          const { data: all, error: allErr } = await supabase
            .from("puzzles")
            .select("category,date");
          if (allErr) throw allErr;
          rows = (all || []).filter((p) => dates.includes(p.date));
        } else {
          rows = data || [];
        }

        const counts = ALL_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: 0 }), {});
        rows.forEach((p) => {
          const cat = (p?.category || "").trim();
          if (counts[cat] != null) counts[cat] += 1;
        });

        setCategoryAchievements(counts);
      } catch (err) {
        console.error("Error loading achievements data:", err);
        const zeros = ALL_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: 0 }), {});
        setCategoryAchievements(zeros);
      }
    })();
  }, [open]);

  // Render the 7-letter tile preview
  const previewTiles = TILE_WORD.split("").map((letter, index) => {
    const isEarned = earnedTileIndexes.includes(index);
    return (
      <div
        key={index}
        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white ${
          isEarned ? "bg-[#3B82F6]" : "bg-gray-300"
        }`}
      >
        {letter}
      </div>
    );
  });

  const totalSolved = Object.values(categoryAchievements).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 overflow-y-auto px-4 pt-10 sm:pt-4 flex justify-center">
        <DialogContent className="relative pt-4 px-4 pb-6 sm:max-w-md w-full flex flex-col items-start max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          <button
            className="absolute top-2 right-2 p-1 text-blue-500 hover:text-blue-600 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <DialogHeader className="w-full">
            <DialogTitle className="text-lg text-gray-800 text-left">Your Achievements</DialogTitle>
          </DialogHeader>

          {/* 🎯 Tiles Section */}
          <div className="w-full text-center bg-gray-100 rounded-lg py-4 px-3 shadow-inner mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Daily Streak: Numerus Tiles</h3>
            <div className="flex justify-center gap-2">{previewTiles}</div>
          </div>

          {/* 🧩 Category Progress (with dynamic targets) */}
          <div className="w-full">
            <h3 className="text-md font-semibold text-gray-800 mb-1 text-center">Category Achievements</h3>
            <h4 className="text-sm text-center text-gray-500 mb-2">Total solved: {totalSolved}</h4>

            <div className="flex flex-col gap-2 sm:gap-2">
              {ALL_CATEGORIES.map((label) => {
                const completed = categoryAchievements[label] || 0;
                const target = nextTarget(completed); // ← 20 → 50 → 100
                const percentage = target ? Math.min(100, (completed / target) * 100) : 0;
                const lowerLabel = label.toLowerCase();
                const color = COLOR_MAP[label] ?? "#3b82f6";

                return (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src={`/icons/${lowerLabel}.png`} alt={`${label} icon`} className="w-8 h-8" />
                      <span className="text-sm font-semibold">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">{`${completed}/${target}`}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
