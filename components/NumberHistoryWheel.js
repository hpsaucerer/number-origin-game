// components/NumberHistoryWheel.js
import React, { useState } from "react";

export default function NumberHistoryWheel({ history }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col md:flex-row items-start gap-4 w-full max-w-4xl">
        {/* ─── Number List ─── */}
        <div className="h-32 md:h-48 w-full md:w-1/2 overflow-y-auto border rounded shadow-inner bg-white">
          <ul className="divide-y">
            {history
              .slice()
              .sort((a, b) => parseFloat(b.number) - parseFloat(a.number))
              .map((p) => (
                <li
                  key={p.number}
                  onClick={() => setSelected(p)}
                  className={`
                    p-3 cursor-pointer hover:bg-yellow-100
                    ${selected?.number === p.number ? "bg-yellow-200 font-bold" : ""}
                  `}
                >
                  {p.number}
                </li>
              ))}
          </ul>
        </div>

        {/* ─── Detail Cards ─── */}
        {selected && (
          <div className="relative w-full md:w-1/2 p-4 border rounded-lg bg-blue-50 shadow-md overflow-visible">
            {/* watermark */}
            <img
              src="/logo.svg"
              alt=""
              className="pointer-events-none absolute top-1 right-1 w-24 opacity-15"
            />

            {/* blue card: formatted number + answer */}
            <div className="bg-blue-100 p-4 rounded-lg mb-2">
              <p className="text-lg font-medium text-gray-900">
                {selected.formatted || selected.number}
              </p>
              <p className="text-sm text-gray-800">{selected.answer}</p>
            </div>

            {/* white card: fun fact */}
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">{selected.funFact}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
