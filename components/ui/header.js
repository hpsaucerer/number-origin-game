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
      <Link href="/" className="flex-1 flex justify-center">
        <img
          src="/logo.svg"
          alt="Game Logo"
          className="h-10 sm:h-12 lg:h-14 w-auto translate-y-2"
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
