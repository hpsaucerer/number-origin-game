import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function AchievementsModal({ open, onClose, earnedTiles = [], categoryAchievements = {} }) {
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
      <div className="fixed inset-0 z-50 overflow-y-auto px-4 pt-10 sm:pt-4 flex justify-center">
<DialogContent
  className="relative pt-4 px-4 pb-6 sm:max-w-md w-full flex flex-col items-start 
             max-h-[90vh] sm:max-h-[80vh] overflow-y-auto"
>



          {/* Dismiss Button */}
          <button
            className="absolute top-2 right-2 p-1 text-blue-500 hover:text-blue-600 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

          <DialogHeader className="w-full">
            <DialogTitle>
              <h2 className="text-lg text-gray-800 text-left">Your Achievements</h2>
            </DialogTitle>
          </DialogHeader>

          {/* 🎯 Tiles Section */}
          <div className="w-full text-center bg-gray-100 rounded-lg py-4 px-3 shadow-inner mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Daily Streak: Numerus Tiles</h3>
            <div className="flex justify-center gap-2">
              {previewTiles}
            </div>
          </div>

          {/* 🧩 Category Progress */}
          <div className="w-full">
            <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">Category Achievements</h3>
            <div className="flex flex-col gap-2 sm:gap-2">
              {categories.map(({ label, color, total }) => {
                const completed = categoryAchievements[label] || 0;
                const percentage = total ? (completed / total) * 100 : 0;
                const lowerLabel = label.toLowerCase();

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
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">{`${completed}/${total}`}</div>
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
