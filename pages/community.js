import { useState } from "react";
import Header from "@/components/ui/header";
import InstructionsModal from "@/components/modals/InstructionsModal";
import CategoryPills from "@/components/CategoryPills";
import StatsModal from "@/components/modals/StatsModal";
import useStats from "@/hooks/useStats";
import { useModal } from "@/context/ModalContext";
import Footer from "@/components/ui/Footer";
import SuggestPuzzleForm from "@/components/SuggestPuzzleForm";

export default function CommunityPage() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { setShowAchievements } = useModal();
  const { stats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();

  return (
    <>
      <Header
        onHelpClick={() => setShowInstructions(true)}
        onStatsClick={() => setShowStats(true)}
        onAchievementsClick={() => setShowAchievements(true)}
      />

      <main className="max-w-3xl mx-auto px-6 pt-4 pb-12 text-center">
        {/* Title with icon */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src="/icons/numerus-cummunity.png" // Change this if your icon file is different
            alt="Community Icon"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-xl font-bold text-gray-800">Suggest a Puzzle</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Have a number you think deserves to be a future puzzle? Submit it below! If we use it, we’ll credit you.
        </p>

        <SuggestPuzzleForm />

        <div className="mt-10">
          <button
            onClick={() => window.location.href = "/"}
            className="mt-4 px-6 py-2 text-white rounded transition"
            style={{ backgroundColor: "#63c4a7" }}
          >
            Back to Game
          </button>
        </div>
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
      
      <Footer />
    </>
  );
}
