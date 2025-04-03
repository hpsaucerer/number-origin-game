import React from "react";

export default function FunFactBox({ text }) {
  if (!text) return null;

  return (
<div className="mt-4 flex items-start gap-4 p-4 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-400 rounded shadow">
  <div className="w-[64px] h-[64px] flex items-center justify-center">
    <img
      src="/icons/funfact.svg"
      alt="Fun Fact Icon"
      className="w-full h-full object-contain"
    />
  </div>
  <p className="text-sm leading-snug">{text}</p>
</div>

  );
}
