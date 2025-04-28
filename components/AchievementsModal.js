import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function AchievementsModal({ open, onClose, earnedTiles = [], categoryAchievements = {} }) {
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
            <h3 className="text-md font-semibold text-gray-800 mb-4 text-center">Category Achievements</h3>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => {
                const { label, color, total } = cat;
                const completed = categoryAchievements[label] || 0;
                const percentage = total ? (completed / total) * 100 : 0;

                const lowerLabel = label.toLowerCase();
                const medal =
                  completed >= 100
                    ? `/medals/${lowerLabel}-gold.png`
                    : completed >= 50
                    ? `/medals/${lowerLabel}-silver.png`
                    : `/medals/${lowerLabel}-bronze.png`; // <-- Always bronze as minimum

                return (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src={`/icons/${lowerLabel}.png`} alt={`${label} icon`} className="w-8 h-8" />
                      <span className="text-sm font-semibold">{label}</span>
                    </div>

                    {/* Bar + Medal */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                          <div
                            className="h-3 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 text-right">{`${completed}/${total}`}</div>
                      </div>

                      {/* Medal */}
                      <img
                        src={medal}
                        alt={`${label} medal`}
                        className="w-14 h-14 object-contain ml-1"
                      />
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
