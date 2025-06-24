// src/pages/AchievementsPage.js
import React from "react";
import NumberHistoryWheel from "../components/NumberHistoryWheel";

export default function AchievementsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Achievements & Puzzle History</h1>

      {/* Section 1: Number Wheel */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Explore Past Numbers</h2>
        <NumberHistoryWheel />
      </section>

      {/* Section 2: Player Medals/Trophies (Placeholder) */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Trophies & Badges</h2>
        <p className="text-gray-600">Coming soon: Your earned medals and stats!</p>
      </section>
    </div>
  );
}
