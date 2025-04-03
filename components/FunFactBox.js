import React from "react";

export default function FunFactBox({ text }) {
  if (!text) return null;

  return (
    <div className="flex items-center bg-yellow-100 text-yellow-900 px-2 py-1 rounded border-l-2 border-yellow-400">
      <img
        src="/icons/funfact.svg"
        alt="Fun Fact"
        className="inline-block w-6 h-6 mr-2"
      />
      <p className="text-sm leading-tight m-0 p-0">{text}</p>
    </div>
  );
}

