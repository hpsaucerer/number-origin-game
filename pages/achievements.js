import React from "react";
import NumberDial from '@/components/NumberDial';

export default function AchievementsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Achievements & Puzzle History</h1>

      {/* Dial-style scroll section */}
      <section className="mb-12">
        <NumberDial />
      </section>

      {/* Section 2: Player Medals/Trophies (Placeholder) */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Trophies & Badges</h2>
        <p className="text-gray-600">Coming soon: Your earned medals and stats!</p>
      </section>
    </div>
  );
}
