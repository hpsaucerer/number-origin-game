import React, { useState } from "react";

const letterRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"]
];

const numberRows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
];

export default function OnScreenKeyboard({ onKeyPress }) {
  const [mode, setMode] = useState("letters"); // "letters" or "numbers"
  const keyboardRows = mode === "letters" ? letterRows : numberRows;

  return (
    <div className="sm:hidden mt-4 space-y-2 w-full max-w-xs mx-auto">
      {/* Keyboard Rows */}
      {keyboardRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center space-x-1"
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="bg-blue-200 text-blue-800 w-10 h-12 rounded text-sm font-semibold hover:bg-blue-300 transition"
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* Bottom row with toggle, space, delete, enter */}
      <div className="flex justify-between space-x-2 mt-2 px-1">
        <button
          onClick={() => setMode(mode === "letters" ? "numbers" : "letters")}
         className="bg-gray-300 text-black w-12 h-12 rounded-md text-base font-semibold hover:bg-gray-400 transition"
        >
          {mode === "letters" ? "123" : "ABC"}
        </button>

        <button
          onClick={() => onKeyPress("␣")}
          className="bg-gray-300 text-black w-[96px] h-12 rounded-md text-base font-semibold hover:bg-gray-400 transition"
        >
          Space
        </button>

        <button
          onClick={() => onKeyPress("←")}
          className="bg-red-400 text-white w-15 h-12 rounded-md text-base font-semibold hover:bg-red-500 transition"
        >
          Delete
        </button>

        <button
          onClick={() => onKeyPress("↵")}
          className="bg-[#63C4A7] text-white w-12 h-12 rounded-md text-base font-semibold hover:opacity-90 transition"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
