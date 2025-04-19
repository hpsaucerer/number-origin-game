import Link from "next/link";
import { FaInstagram, FaXTwitter, FaFacebook, FaTiktok } from "react-icons/fa6";
import Header from "../components/ui/header";
import { useState } from "react";
import InstructionsModal from "@/components/modals/InstructionsModal";
import CategoryPills from "@/components/CategoryPills";
import StatsModal from "@/components/modals/StatsModal";
import useStats from "@/hooks/useStats";

export default function AboutPage() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { stats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();
  return (
    <>
      <Header
  onHelpClick={() => setShowInstructions(true)}
  onStatsClick={() => setShowStats(true)}
/>
      <main className="max-w-3xl mx-auto px-6 pt-4 pb-12 text-center">

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Numerus</h1>

        <p className="text-lg text-gray-600 mb-6">
          A reverse trivia game that celebrates the magic, mystery, and meaning behind numbers.
        </p>

        <blockquote className="italic text-gray-500 mb-10">
          “Numbers rule the universe.” — Pythagoras
        </blockquote>

        <section className="text-center mb-12 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">The Story</h2>
          <p className="text-gray-600 leading-relaxed">
          Created by a former teacher with a love for trivia, board games, and curious facts, Numerus blends number-based puzzles with clever clues.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Follow Us</h2>
<div className="flex justify-center space-x-4 mt-4 text-2xl text-[#3B82F6]">
  <a href="https://instagram.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <FaInstagram />
  </a>
  <a href="https://x.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
    <FaXTwitter />
  </a>
  <a href="https://facebook.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <FaFacebook />
  </a>
  <a href="https://tiktok.com/@YOUR_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
    <FaTiktok />
  </a>
</div>
        </section>

        <Link href="/">
          <button className="mt-1 px-6 py-2 text-white rounded transition" style={{ backgroundColor: '#63c4a7' }}>
            Start Playing
          </button>
        </Link>

      </main>

      {/* 👇 Modals go right here */}
{showInstructions && (
  <InstructionsModal
    open={showInstructions}
    onClose={() => setShowInstructions(false)}
    renderCategoryPills={() => <CategoryPills />}
  />
)}

{showStats && (
  <StatsModal
    open={showStats}
    onClose={() => setShowStats(false)}
    stats={stats}
    data={data}
    COLORS={COLORS}
    combinedLabel={combinedLabel}
    renderCenterLabel={renderCenterLabel}
  />
)}

    </>
  );
}
