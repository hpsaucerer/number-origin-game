import React from "react";

export default function FunFactBox({ puzzle }) {
  const funFact = puzzle?.funFact || puzzle?.fun_fact; // ✅ define funFact from either field

  if (!funFact) return null;

  return (
    <div className="mt-4 px-4">
      <div className="max-w-prose mx-auto flex flex-col items-center pt-2 pb-4 px-4 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded-lg shadow-sm text-center">
        <img
          src="/icons/nugget-knowledge.png"
          alt="Fun Fact Icon"
          className="w-28 h-auto max-h-28 mt-2 mb-3"
        />
        <p className="text-sm md:text-lg leading-relaxed text-center text-gray-800">
          {funFact}
        </p>
      </div>
    </div>
  );
}
