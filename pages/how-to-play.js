"use client";

import Link from "next/link";
import Header from "@/components/ui/header";

export default function HowToPlay() {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">How to Play</h1>

        <ul className="space-y-8 text-lg">
          <li>
            <strong>1. Look at the number.</strong><br />
            Think about what it could signify. (e.g. "keys on a piano", "moon landing", etc.)
          </li>

          <li>
            <strong>2. Make a guess.</strong><br />
            You have <strong>4 guesses</strong> to figure it out.
          </li>

          <li>
            <strong>3. Reveal clues if needed.</strong><br />
            Each clue you reveal will use up a guess.
          </li>

          <li>
            <strong>4. Solve it or try again tomorrow!</strong><br />
            Daily puzzles reset at midnight UK time.
          </li>
        </ul>

        <div className="mt-10 text-center">
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow">
              Back to Game
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
