"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function AchievementsModal({ open, onClose, earnedTiles, categoryAchievements }) {
  const categories = ["Maths", "Geography", "Science", "History", "Culture", "Sport"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Your Achievements</DialogTitle>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </DialogHeader>

        {/* Daily Streak */}
        <div className="text-center my-4">
          <h3 className="font-semibold mb-2">Daily Streak: Numerus Tiles</h3>
          <div className="flex justify-center gap-2">
            {earnedTiles.length > 0 ? (
              earnedTiles.map((tile, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-bold rounded-md"
                >
                  {tile}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tiles earned yet!</p>
            )}
          </div>
        </div>

        {/* Category Achievements */}
        <div className="text-center my-6">
          <h3 className="font-semibold mb-2">Category Achievements</h3>
          <div className="flex flex-col gap-3 items-center">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-3 w-64">
                <div className="flex-1 text-left font-medium">{category}</div>
                <div
                  className={`w-32 h-4 rounded-full ${
                    categoryAchievements?.[category]
                      ? "bg-green-400"
                      : "bg-gray-300"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
