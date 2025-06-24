import React, { useState } from "react";

const PUZZLE_HISTORY = {
  357: "Mirrors inside the Galerie de Glaces at Versailles",
  23: "Stab wounds inflicted upon Julius Caesar",
  "9.58": "Men’s 100m sprint record set by Usain Bolt",
  206: "Number of bones in the human body",
  480: "Battle of Thermopylae",
  73: "Sheldon Cooper’s ‘best number’"
  // Add more as needed
};

export default function NumberHistoryWheel() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-semibold">Your Puzzle History</h2>

      <div className="h-48 w-full max-w-sm overflow-y-scroll border rounded shadow-inner bg-white">
        <ul className="divide-y">
          {Object.keys(PUZZLE_HISTORY)
            .sort((a, b) => parseFloat(b) - parseFloat(a))
            .map((num) => (
              <li
                key={num}
                onClick={() => setSelected(num)}
                className={`p-3 cursor-pointer hover:bg-yellow-100 ${
                  selected === num ? "bg-yellow-200 font-bold" : ""
                }`}
              >
                {num}
              </li>
            ))}
        </ul>
      </div>

      {selected && (
        <div className="max-w-sm text-center mt-2 p-4 border bg-yellow-50 rounded shadow">
          <p className="text-lg font-medium">#{selected}</p>
          <p className="text-sm mt-1">{PUZZLE_HISTORY[selected]}</p>
        </div>
      )}
    </div>
  );
}
