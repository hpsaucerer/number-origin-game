import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function WhatsNewModal({ open, onClose }) {
  const TILE_WORD = "NUMERUS";

  // Dummy data – always highlight first 3 tiles for the modal preview
  const previewTiles = TILE_WORD.split("").map((letter, index) => {
    const isEarned = index < 3;
    return (
      <div
        key={index}
        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white ${
          isEarned ? "bg-[#3B82F6]" : "bg-gray-300 text-gray-400"
        }`}
      >
        {letter}
      </div>
    );
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex justify-center z-50 px-4 sm:items-center">
        <DialogContent className="relative max-h-[90vh] sm:max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
          {/* 🔁 Scrollable inner wrapper */}
          <div className="overflow-y-auto max-h-[calc(100dvh-5rem)] w-full px-4 pt-3 pb-4 scroll-smooth">

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 p-2 text-blue-500 hover:text-blue-600 z-50"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <DialogHeader className="w-full pr-10">
              <DialogTitle>
                <h2 className="text-base text-gray-800 text-left">1.0. What's new on Numerus?</h2>
              </DialogTitle>
            </DialogHeader>

            {/* Intro Text */}
            <div className="w-full text-center mb-2">
              <p className="text-base font-medium text-gray-800">
                Introducing... <strong>Daily Streak – build your Numerus!</strong>
              </p>
            </div>

            {/* Tiles Preview */}
            <div className="w-full text-center bg-gray-100 rounded-lg py-4 px-3 shadow-inner mb-2">
              <div className="flex justify-center gap-2 mb-3">
                {previewTiles}
              </div>

              <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
                Earn a tile each day you play to spell out <strong>NUMERUS</strong> and receive category reveal tokens!
              </p>

              {/* 🔔 New Button Intro */}
              <p className="text-sm font-semibold text-gray-800 mb-2">A new button joins the game!</p>

              {/* 🔓 Category Reveal Button Image */}
              <div>
                <img
                  src="/images/reveal-category.png"
                  alt="Reveal Category Button"
                  className="mx-auto w-56 h-auto rounded shadow animate-glow-pop"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use your tokens to reveal the category for tricky puzzles!
                </p>
              </div>
            </div>

            {/* Category Achievements Preview */}
            <div className="w-full mt-4">
              <p className="text-base font-medium text-gray-800 text-center mb-2">
                Introducing... <strong>Category Achievements</strong>
              </p>

              <img
                src="/images/achievements-preview.png"
                alt="Category Achievements Preview"
                className="w-full rounded-lg shadow-md"
              />

              <p className="text-base font-medium text-gray-700 text-center mt-2">
                Track your progress and unlock in-game rewards and trophies in each category!
              </p>
            </div>

            {/* ➕ New Final Line */}
            <p className="text-sm text-gray-600 text-center mt-4">
              ➕ Several bugs fixes and improved guess validation logic.
            </p>

            {/* Confirm Button */}
            <button
              onClick={onClose}
              className="mt-6 text-white px-4 py-2 rounded w-full hover:opacity-90 transition"
              style={{ backgroundColor: "#63c4a7" }}
            >
              Got it!
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
