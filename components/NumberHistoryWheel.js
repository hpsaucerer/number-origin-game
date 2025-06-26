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

  const formattedNumber =
    selected && !isNaN(Number(selected))
      ? Number(selected).toLocaleString()
      : selected;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col md:flex-row items-start gap-4 w-full max-w-4xl">
        {/* ——— number list */}
        <div className="h-32 md:h-48 w-full md:w-1/2 overflow-y-auto border rounded shadow-inner bg-white">
          <ul className="divide-y">
            {history
              .map((p) => p.number)
              .sort((a, b) => parseFloat(b) - parseFloat(a))
              .map((num) => (
                <li
                  key={num}
                  onClick={() => setSelected(num)}
                  className={`
                    p-3 cursor-pointer hover:bg-yellow-100
                    ${selected === num ? "bg-yellow-200 font-bold" : ""}
                  `}
                >
                  {num}
                </li>
              ))}
          </ul>
        </div>

        {/* ——— detail card */}
        {selected && (
          <div className="relative w-full md:w-1/2 p-4 border rounded-lg bg-blue-50 shadow-md overflow-visible">
            {/* watermark (inverted to black) */}
           <img
             src="/logo.svg"
             alt=""
             className="
             pointer-events-none
             absolute top-0 right-0
             w-24
             filter brightness-0 saturate-100 opacity-15
             "
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
    </div>
  );
}
