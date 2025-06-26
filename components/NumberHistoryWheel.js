// components/NumberHistoryWheel.js
import React, { useState } from "react";

export default function NumberHistoryWheel({ history }) {
  const [selected, setSelected] = useState(null);

  // sort descending numerically
  const list = [...history].sort(
    (a, b) => parseFloat(b.number) - parseFloat(a.number)
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="sr-only">Your Puzzle History</h2>

      <div className="h-48 w-full max-w-sm overflow-y-auto border rounded shadow-inner bg-white">
        <ul className="divide-y">
          {list.map(({ number }) => (
            <li
              key={number}
              onClick={() => setSelected(number)}
              className={`p-3 cursor-pointer hover:bg-yellow-100 ${
                selected === number ? "bg-yellow-200 font-bold" : ""
              }`}
            >
              {number}
            </li>
          ))}
        </ul>
      </div>

      {selected && (
  <div className="relative max-w-sm text-center mt-2 p-4 border bg-blue-50 rounded shadow overflow-hidden">
    {/* watermark in the corner */}
    <img
      src="/logo.svg"
      alt=""
      className="absolute bottom-2 right-2 w-24 h-24 opacity-10 pointer-events-none"
    />
    <p className="text-lg font-medium">{formattedNumber || selected}</p>
    <p className="text-sm mt-1">{PUZZLE_HISTORY[selected]}</p>
  </div>
)}
    </div>
  );
}
