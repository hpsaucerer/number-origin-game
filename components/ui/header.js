import { useState } from "react";
import Link from "next/link";
import { BookOpen, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ onHelpClick, onStatsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <header>
      {/* Logo and Menu Row */}
      <div className="bg-[#3B82F6] px-4 py-2 flex items-center justify-between h-16 max-w-screen-lg w-full mx-auto">
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl font-bold px-1 hover:text-blue-200"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <Link href="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="Game Logo"
              className="h-18 sm:h-16 md:h-20 lg:h-28 xl:h-52 w-auto translate-y-4"
            />
          </Link>
        </div>

        {/* Right-side icon buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={onHelpClick}
            className="bg-white border border-[#3B82F6] px-3 py-2 rounded-lg hover:bg-[#3B82F6] hover:text-white transition shadow-md"
            title="How to Play"
            aria-label="How to Play"
          >
            <BookOpen size={20} strokeWidth={2.25} className="text-[#3B82F6]" />
          </Button>

          <Button
            onClick={onStatsClick}
            className="group bg-white border border-[#3B82F6] px-2 py-1 rounded hover:bg-[#3B82F6] hover:text-white transition"
            title="Your Stats"
            aria-label="Your Stats"
          >
            <BarChart size={20} className="text-[#3B82F6] group-hover:text-white transition" />
          </Button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-2 bg-white shadow-md rounded-md z-50 w-40">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
            onClick={() => setMenuOpen(false)}
          >
            Daily Puzzle
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
