import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function WhatsNewModal({ open, onClose, earnedTiles = [], categoryAchievements = {} }) {
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
              <h2 className="text-lg text-gray-800 text-left">🎉 What's New in Numerus</h2>
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-700 mt-1 mb-4 leading-relaxed">
            We’ve added new features to make your experience even more fun! Check out what’s new:
          </p>

          {/* Tiles Preview */}
          <div className="w-full text-center bg-gray-100 rounded-lg py-4 px-3 shadow-inner mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">✨ Daily Streak: Earn Numerus Tiles</h3>
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

          {/* Progress Bars */}
          <div className="w-full">
            <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">📊 Category Achievements</h3>
            <div className="flex flex-col gap-3">
              {categories.map(({ label, color, total }) => {
                const completed = categoryAchievements[label] || 0;
                const percentage = (completed / total) * 100;
                return (
                  <div key={label}>
                    <div className="flex items-center gap-2">
                      <img src={`/icons/${label.toLowerCase()}.png`} alt={label} className="w-6 h-6" />
                      <span className="text-sm font-semibold">{label}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="h-2.5 rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right">{`${completed}/${total}`}</div>
                  </div>
                );
              })}
            </div>
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
