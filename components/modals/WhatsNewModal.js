import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function WhatsNewModal({ open, onClose, earnedTiles = [], categoryAchievements = {} }) {
  const TILE_WORD = "NUMERUS";
  const nextTileIndex = earnedTiles.length;

const previewTiles = TILE_WORD.split("").map((letter, index) => {
  return (
    <div
      key={index}
      style={{ animationDelay: `${index * 0.15}s` }}
      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white ${
        index < 3 ? "bg-[#3B82F6] animate-fade-in" : "bg-gray-300"
      }`}
    >
      {letter}
    </div>
  );
});

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <DialogContent className="relative max-h-[90vh] overflow-y-auto pt-3 px-4 pb-4 sm:max-w-md w-full flex flex-col items-start justify-center">

          {/* Close Button */}
          <button
            className="absolute top-2 right-2 p-1 text-blue-500 hover:text-blue-600"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <DialogHeader className="w-full">
            <DialogTitle>
              <h2 className="text-lg text-gray-800 text-left">Update 1.0. What's new on Numerus</h2>
            </DialogTitle>
          </DialogHeader>

          {/* Intro Text */}
          <div className="w-full text-center mb-2">
            <p className="text-base font-medium text-gray-800">
              Introducing.. <strong>Daily Streak – Build your Numerus!</strong>
            </p>
          </div>

          {/* Tiles Preview */}
          <div className="w-full text-center bg-gray-100 rounded-lg py-4 px-3 shadow-inner mb-2">
            <div className="flex justify-center gap-2 mb-3">
              {previewTiles}
            </div>

            <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
              Earn a tile each day you play to spell out <strong>NUMERUS</strong> and earn category reveal tokens!
            </p>

            {/* 🔔 New Button Intro */}
            <p className="text-sm font-semibold text-gray-800 mb-2">A new button joins the game!</p>

            {/* 🔓 Category Reveal Button Image */}
            <div>
              <img
                src="/images/reveal-category-button.png"
                alt="Reveal Category Button"
                className="mx-auto w-56 h-auto rounded shadow"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use your tokens to reveal the category for tricky puzzles!
              </p>
            </div>
          </div>

          {/* Category Achievements Preview Image Section */}
          <div className="w-full mt-4">
            <p className="text-base font-medium text-gray-800 text-center mb-2">
              Introducing.. <strong>Category Achievements</strong>
            </p>

            <img
              src="/images/achievements-preview.png"
              alt="Category Achievements Preview"
              className="w-full rounded-lg shadow-md"
            />

            <p className="text-base font-medium text-gray-700 text-center mt-2">
              Track your progress and unlock rewards in each category!
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onClose}
            className="mt-6 text-white px-4 py-2 rounded w-full hover:opacity-90 transition"
            style={{ backgroundColor: "#63c4a7" }} // ← brand green
          >
            Got it!
          </button>
        </DialogContent>
      </div>
    </Dialog>
  );
}
