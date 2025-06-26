// components/NumberHistoryWheel.js
import React, { useState } from "react";

const PUZZLE_HISTORY = {
  357: "Mirrors inside the Galerie de Glaces at Versailles",
  23: "Stab wounds inflicted upon Julius Caesar",
  "9.58": "Men’s 100m sprint record set by Usain Bolt",
  206: "Number of bones in the human body",
  480: "Battle of Thermopylae",
  73: "Sheldon Cooper’s ‘best number’",
  // …etc.
};

export default function NumberHistoryWheel({ history }) {
  const [selected, setSelected] = useState(null);

  // format numeric strings, fallback to raw if NaN
  const formattedNumber =
    selected && !isNaN(Number(selected))
      ? Number(selected).toLocaleString()
      : selected;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* scrollable list */}
      <div className="h-48 w-full max-w-sm overflow-y-scroll border rounded shadow-inner bg-white">
        <ul className="divide-y">
          {history
            .map((p) => p.number)
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

      {/* detail card */}
      {selected && (
        <div className="relative max-w-sm w-full p-4 border rounded-lg bg-blue-50 shadow-md">
          {/* watermark logo */}
          <img
            src="/logo.svg"
            alt=""
            className="pointer-events-none absolute top-2 right-2 w-24 opacity-10"
          />

          <p className="text-lg font-medium text-gray-900">
            {formattedNumber}
          </p>
          <p className="text-sm mt-1 text-gray-700">
            {history.find((p) => p.number === selected)?.fact}
          </p>
        </div>
      )}
    </div>
  );
}
