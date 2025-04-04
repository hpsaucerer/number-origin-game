import React from "react";

export default function FunFactBox({ puzzle }) {
  if (!puzzle?.funFact) return null;

  return (
    <div className="mt-4 flex items-start gap-4 p-4 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded shadow">
      <img
        src="/icons/funfact.svg"
        alt="Fun Fact Icon"
        className="w-16 h-16 flex-shrink-0"
      />
      <p className="text-sm leading-snug">{puzzle.funFact}</p>
    </div>
  );
}

