// components/AnswerBanner.js
"use client";

// Brand colours — swap these for your exact hex codes
const BRAND = {
  green: {
    main:  "#63c4a7", // strong text/pill background
    soft:  "#63c4a7", // pale label strip
    border:"#63c4a7", // borders
  },
  red: {
    main:  "#e53935",
    soft:  "#e53935",
    border:"#e53935",
  },
};

export default function AnswerBanner({ answer, correct }) {
  const palette = correct ? BRAND.green : BRAND.red;
  const statusWord = correct ? "Correct" : "Incorrect";

  return (
    <div role="status" aria-live="polite" className="mt-4 w-full flex justify-center">
      <div className="w-full max-w-[600px] px-4">
        {/* Top label bar */}
        <div
          className="border rounded-t-xl px-3 py-1"
          style={{
            backgroundColor: palette.soft,
            borderColor: palette.border,
            color: palette.main,
          }}
        >
          <div className="w-full flex items-center justify-center gap-2 flex-wrap">
            {/* Status pill */}
            <span
              className="inline-flex items-center rounded-full px-2 py-[2px] text-[10px] sm:text-xs font-bold uppercase"
              style={{ backgroundColor: palette.main, color: "#fff" }}
            >
              {statusWord}
            </span>

            {/* “The answer is” text */}
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
              The answer is
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          className="border border-t-0 rounded-b-xl bg-white shadow-sm"
          style={{ borderColor: palette.border }}
        >
          <p className="text-center text-base sm:text-lg font-semibold text-gray-900 py-3 px-4 leading-snug">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
