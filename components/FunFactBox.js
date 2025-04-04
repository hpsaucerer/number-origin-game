import React from "react";

export default function FunFactBox({ puzzle }) {
  if (!puzzle?.funFact) return null;

  return (
<div className="mt-4 flex flex-col items-center pt-2 pb-4 px-4 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded-lg shadow-sm text-center">
  <img
    src="/icons/funfact.svg"
    alt="Fun Fact Icon"
    className="w-24 h-24 -mt-2 -mb-2"
  />
  <p className="text-sm leading-snug max-w-sm">
    {puzzle.funFact}
  </p>
</div>

  );
}
