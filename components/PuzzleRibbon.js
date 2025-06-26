import React, { useState } from 'react';
import puzzles from '@/data/puzzleData'; // your puzzle history object

export default function PuzzleRibbon() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4">Your Numberline</h2>

      {/* Scrollable Ribbon */}
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-3 px-2 py-2 whitespace-nowrap">
          {Object.keys(puzzles)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .map((num) => (
              <button
                key={num}
                onClick={() => setSelected(num)}
                className={`min-w-[60px] px-4 py-2 rounded shadow text-sm font-medium border 
                  ${selected === num ? 'bg-yellow-300 border-yellow-500' : 'bg-white hover:bg-yellow-100'}`}
              >
                {puzzles[num].formatted || num}
              </button>
            ))}
        </div>
      </div>

      {/* Selected Puzzle Details */}
      {selected && (
        <div className="mt-6 p-4 border bg-yellow-50 rounded shadow text-center max-w-md">
          <p className="text-lg font-bold">{puzzles[selected].formatted || selected}</p>
          <p className="mt-1 text-sm">{puzzles[selected].answer}</p>
        </div>
      )}
    </div>
  );
}
