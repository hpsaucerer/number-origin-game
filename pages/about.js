import Link from "next/link";
import { FaInstagram, FaXTwitter, FaFacebook, FaTiktok } from "react-icons/fa6";
import Header from "../components/ui/header";
import { useState } from "react";
import InstructionsModal from "@/components/modals/InstructionsModal";
import CategoryPills from "@/components/CategoryPills";
import StatsModal from "@/components/modals/StatsModal";
import useStats from "@/hooks/useStats";
import { track } from '@vercel/analytics';
import Footer from "@/components/ui/Footer";
import { useModal } from "@/context/ModalContext"; // ✅ import useModal

export default function AboutPage() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { stats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();
  const { setShowAchievements } = useModal(); // ✅ grab setter

  return (
    <>
      <Header
        onHelpClick={() => setShowInstructions(true)}
        onStatsClick={() => setShowStats(true)}
        onAchievementsClick={() => setShowAchievements(true)} // ✅ wire it up
      />
      <main className="max-w-3xl mx-auto px-6 pt-4 pb-12 text-center">

        <h1 className="text-xl font-bold text-gray-800 mb-2">Welcome to Numerus</h1>

        <p className="text-lg text-gray-600 mb-6">
          A reverse trivia game that celebrates the magic, mystery, and meaning behind numbers.
        </p>

        <blockquote className="italic text-gray-500 mb-10">
          “Numbers rule the universe.” — Pythagoras
        </blockquote>

        <section className="text-center mb-8 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">The Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Created by a former teacher with a love for trivia, board games, and curious facts, Numerus blends number-based puzzles with clever clues.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Follow Us</h2>
          <div className="flex justify-center space-x-4 mt-4 text-2xl text-[#3B82F6]">
            <a
              href="https://instagram.com/numerusgame"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onClick={() => track('Click Instagram')}
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/numerusgame"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              onClick={() => track('Click Twitter')}
            >
              <FaXTwitter />
            </a>
            <a
              href="https://facebook.com/numerusgame"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              onClick={() => track('Click Facebook')}
            >
              <FaFacebook />
            </a>
            <a
              href="https://tiktok.com/@numerusgame"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              onClick={() => track('Click TikTok')}
            >
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
      <Footer />
    </>
  );
}
