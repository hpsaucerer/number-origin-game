// components/AnswerBanner.js
"use client";

export default function AnswerBanner({ answer, correct }) {
  const c = correct
    ? {
        barBg: "bg-green-100",
        barText: "text-green-900",
        barBorder: "border-green-200",
        bodyBorder: "border-green-200",
        label: "Correct! The answer is",
      }
    : {
        barBg: "bg-red-100",
        barText: "text-red-900",
        barBorder: "border-red-200",
        bodyBorder: "border-red-200",
        label: "Incorrect! The answer is",
      };

  return (
    <div role="status" aria-live="polite" className="mt-4 w-full flex justify-center">
      <div className="w-full max-w-[600px] px-4">
        {/* Top label bar */}
        <div
          className={[
            c.barBg,
            c.barText,
            c.barBorder,
            "text-center text-[10px] sm:text-xs font-semibold tracking-wide uppercase",
            "border rounded-t-xl px-3 py-1",
          ].join(" ")}
        >
          {c.label}
        </div>

        {/* Body */}
        <div className={["border border-t-0 rounded-b-xl bg-white shadow-sm", c.bodyBorder].join(" ")}>
          <p className="text-center text-base sm:text-lg font-semibold text-gray-900 py-3 px-4 leading-snug">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
