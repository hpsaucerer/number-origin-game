import React from "react";

export default function FunFactBox({ text }) {
  if (!text) return null;

  return (
    <div className="flex items-center bg-yellow-100 text-yellow-900 px-3 py-2 rounded border-l-4 border-yellow-400 shadow-sm">
      <img
        src="/icons/funfact.svg"
        alt="Fun Fact"
        className="inline-block w-5 h-5 mr-2"
      />
      <p className="text-sm leading-snug m-0 p-0">{text}</p>
    </div>
  );
}


