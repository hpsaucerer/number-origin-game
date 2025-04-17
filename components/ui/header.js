import { useState } from "react";
import Link from "next/link";
import { BookOpen, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ onHelpClick, onStatsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="bg-[#3B82F6] px-4 py-2 flex items-center justify-between h-16 max-w-screen-lg w-full mx-auto">
        {/* Left Side: Hamburger + Logo */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl font-bold px-1 hover:text-blue-200"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-50 transition-all duration-200 ease-out">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
              >
                Daily Puzzle
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
              >
                About
              </Link>
            </div>
          )}
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
    </header>
  );
}
