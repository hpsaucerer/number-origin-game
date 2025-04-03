import React from "react";

export default function FunFactBox({ text }) {
  if (!text) return null;

return (
  <div className="flex items-start bg-yellow-100 text-yellow-900 px-3 py-2 rounded border-l-2 border-yellow-400">
    <img
      src="/icons/funfact.svg"
      alt="Fun Fact"
      className="w-8 h-8 mt-1 mr-2"
    />
    <p className="text-sm leading-tight m-0 p-0">{text}</p>
  </div>
);
