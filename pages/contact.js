import Link from "next/link";
import { useState } from "react";
import Header from "@/components/ui/header";
import InstructionsModal from "@/components/modals/InstructionsModal";
import CategoryPills from "@/components/CategoryPills";
import StatsModal from "@/components/modals/StatsModal";
import useStats from "@/hooks/useStats";
import { FaEnvelope } from "react-icons/fa";

export default function ContactPage() {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h1>

        <p className="text-gray-600 mb-6">
          Have a question, suggestion, or just want to say hi? We'd love to hear from you!
        </p>

<div className="flex items-center justify-center gap-2 text-blue-600 underline mb-6">
  <FaEnvelope />
  <a href="mailto:info@numerus.site">info@numerus.site</a>
</div>


        <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">💬 Feedback</h2>
          <p className="text-gray-600 mb-2">
            Love Numerus? Loathe it? Let us know what you think!
          </p>
          <Link href="https://forms.gle/tiei52osD5KNW3BE7" target="_blank">
            <button className="mt-2 px-6 py-2 bg-[#3B82F6] text-white rounded hover:bg-blue-700 transition">
              Fill out the Feedback Form
            </button>
          </Link>
        </div>

        <Link href="/">
          <button className="mt-1 px-6 py-2 text-white rounded transition" style={{ backgroundColor: '#63c4a7' }}>
            Back to Game
          </button>
        </Link>
      </main>

      {/* 👇 Modals */}
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
