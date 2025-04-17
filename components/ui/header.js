// components/Header.js
import Link from "next/link";
import { BarChart } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function Header({ onHelpClick, onStatsClick }) {
  return (
    <header className="bg-[#3B82F6] p-2 flex items-center justify-between h-14">
      {/* Left: Hamburger menu */}
      <div className="flex items-center">
        {/* Add your hamburger menu here if applicable */}
      </div>

      {/* Center: Logo */}
<Link href="/about" className="flex justify-center flex-1">
  <img
    src="/logo.svg"
    alt="Game Logo"
    className="h-18 sm:h-16 md:h-20 lg:h-28 xl:h-36 w-auto translate-y-4"
  />
</Link>

      {/* Right: Icons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onHelpClick}
          className="bg-white p-2 rounded shadow"
          aria-label="How to Play"
        >
          <BookOpen className="text-[#3B82F6]" />
        </button>
        <button
          onClick={onStatsClick}
          className="bg-white p-2 rounded shadow"
          aria-label="Stats"
        >
          <BarChart className="text-[#3B82F6]" />
        </button>
      </div>
    </header>
  );
}
