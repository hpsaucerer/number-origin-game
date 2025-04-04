import React from "react";

export default function FunFactBox({ puzzle }) {
  if (!puzzle?.funFact) return null;

  return (
    <div className="mt-6 flex flex-col items-center p-6 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded-xl shadow-md text-center">
      <img
        src="/icons/funfact.svg"
        alt="Fun Fact Icon"
        className="w-20 h-20 mb-4"
      />
      <p className="text-base leading-relaxed max-w-md">
        {puzzle.funFact}
      </p>
    </div>
  );
}
