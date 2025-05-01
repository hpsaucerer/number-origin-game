import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function WhatsNewModal({ open, onClose, earnedTiles = [], categoryAchievements = {} }) {
  const TILE_WORD = "NUMERUS";
  const nextTileIndex = earnedTiles.length;

  const previewTiles = TILE_WORD.split("").map((letter, index) => {
    const isEarned = index < nextTileIndex;
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

  const categories = [
    { label: "Maths", color: "#3b82f6", total: 20 },
    { label: "Geography", color: "#63c4a7", total: 20 },
    { label: "Science", color: "#f57d45", total: 20 },
    { label: "History", color: "#f7c548", total: 20 },
    { label: "Culture", color: "#8e44ad", total: 20 },
    { label: "Sport", color: "#e53935", total: 20 },
  ];

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
              <h2 className="text-lg text-gray-800 text-left">🎉 What's New? </h2>
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-700 mt-1 mb-4 leading-relaxed">
            Introducing: Daily Streak - Build your Numerus!
          </p>

{/* Tiles Preview */}
<div className="w-full text-center bg-gray-100 rounded-lg py-4 px-3 shadow-inner mb-6">
  <div className="flex justify-center gap-2 mb-3">
    {Array.from("NUMERUS").map((letter, idx) => (
      <div
        key={idx}
        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white ${
          earnedTiles.includes(letter) ? "bg-[#3B82F6]" : "bg-gray-300"
        }`}
      >
        {letter}
      </div>
    ))}
  </div>

  <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
    Earn a tile each day you play — spell out <strong>NUMERUS</strong> and earn free category reveal tokens!
  </p>

  {/* 🔔 New Button Intro */}
  <p className="text-sm font-semibold text-gray-800 mb-2">A new button joins the game!</p>

  {/* 🔓 Category Reveal Button Image */}
  <div>
    <img
      src="/images/reveal-category-button.png"
      alt="Reveal Category Button"
      className="mx-auto w-48 h-auto rounded shadow"
    />
    <p className="text-xs text-gray-500 mt-1">Use your tokens to reveal the category for tricky puzzles!</p>
  </div>
</div>


{/* Category Achievements Preview Image Section */}
<div className="w-full mt-6">
  <p className="text-sm text-gray-700 font-vietnam mb-3">
    Introducing: <strong>Category Achievements</strong>
  </p>

  <img
    src="/images/category-achievements-preview.png"
    alt="Category Achievements Preview"
    className="w-full rounded-lg shadow-md"
  />
</div>


          <button
            onClick={onClose}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Got it!
          </button>

        </DialogContent>
      </div>
    </Dialog>
  );
}
