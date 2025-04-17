import { useState } from "react";
import Link from "next/link";
import { BarChart, BookOpen, Menu } from "lucide-react";

export default function Header({ onHelpClick, onStatsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#3B82F6] p-2 relative z-50">
      <div className="flex items-center justify-between h-14">
        {/* Hamburger Icon */}
        <div className="flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl ml-2 focus:outline-none"
            aria-label="Menu"
          >
            <Menu />
          </button>
        </div>

        {/* Logo */}
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
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-2 bg-white rounded shadow-md mt-2 py-2 px-4 space-y-2 w-44">
          <Link
            href="/game"
            className="block text-[#3B82F6] hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Game
          </Link>
          <Link
            href="/about"
            className="block text-[#3B82F6] hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <a
            href="https://example.com/feedback"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#3B82F6] hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Feedback
          </a>
        </div>
      )}
    </header>
  );
}
