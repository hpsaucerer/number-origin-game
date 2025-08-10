// components/AnswerBanner.js
"use client";

// Your single brand hexes
const BRAND_GREEN = "#63c4a7";
const BRAND_RED   = "#e53935";

// tiny helper: #RRGGBB -> rgba(r,g,b,alpha)
function hexToRgba(hex, alpha = 1) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return hex; // fallback to raw hex if parsing fails
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AnswerBanner({ answer, correct }) {
  const main    = correct ? BRAND_GREEN : BRAND_RED;
  const softBg  = hexToRgba(main, 0.12); // pale label strip
  const border  = hexToRgba(main, 0.35); // subtle border
  const status  = correct ? "Correct" : "Incorrect";

  return (
    <div role="status" aria-live="polite" className="mt-4 w-full flex justify-center">
      <div className="w-full max-w-[600px] px-4">
        {/* Top label bar */}
        <div
          className="border rounded-t-xl px-3 py-1"
          style={{ backgroundColor: softBg, borderColor: border, color: main }}
        >
          <div className="w-full flex items-center justify-center gap-2 flex-wrap">
            {/* Status pill */}
            <span
              className="inline-flex items-center rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-bold uppercase"
              style={{ backgroundColor: main, color: "#fff" }}
            >
              {status}
            </span>

            {/* “The answer is” text */}
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
              The answer is
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="border border-t-0 rounded-b-xl bg-white shadow-sm" style={{ borderColor: border }}>
          <p className="text-center text-sm sm:text-base font-medium text-gray-900 py-2 px-4 leading-snug break-words hyphens-auto">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
