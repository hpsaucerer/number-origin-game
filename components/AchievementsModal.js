import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function AchievementsModal({ open, onClose, earnedTiles = [], categoryAchievements = {} }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <DialogContent className="relative max-h-[90vh] overflow-y-auto pt-3 px-4 pb-4 sm:max-w-md w-full flex flex-col items-start justify-center">
          {/* Dismiss Button */}
          <button
            className="absolute top-1 right-1 p-2 text-blue-500 hover:text-blue-600 transition"
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

          {/* Tiles Section */}
          <div className="mt-4 w-full text-center">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Daily Streak: Numerus Tiles</h3>
            <div className="flex justify-center gap-2">
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
          </div>

          {/* Category Achievements Section */}
          <div className="mt-6 w-full">
            <h3 className="text-md font-semibold text-gray-700 mb-2 text-center">Category Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(categoryAchievements).map(([category, unlocked]) => (
                <div
                  key={category}
                  className={`flex items-center gap-2 p-2 border rounded-lg ${
                    unlocked ? "border-green-400" : "border-gray-300"
                  }`}
                >
                  <img
                    src={`/icons/${category.toLowerCase()}.png`}
                    alt={`${category} icon`}
                    className="w-8 h-8"
                  />
                  <span className={`font-semibold ${unlocked ? "text-green-600" : "text-gray-400"}`}>
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
