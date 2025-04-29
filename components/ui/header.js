import { useState } from "react";
import Link from "next/link";
import { CircleDot, Trophy } from "lucide-react"; // ✅ Update imports: Trophy instead of BookOpen
import { Button } from "@/components/ui/button";
import PieChartIcon from "@/components/icons/PieChartIcon";

export default function Header({ onStatsClick, onAchievementsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="bg-[#3B82F6] px-4 py-2 flex items-center justify-between h-16 max-w-screen-lg w-full mx-auto">
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center gap-0 sm:gap-3">
          {/* Hamburger + Dropdown */}
          <div className="relative flex items-start">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl font-bold px-1 hover:text-blue-200"
              aria-label="Toggle menu"
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg z-50 transition-all duration-200 ease-out">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
                >
                  Daily Puzzle
                </Link>
                <Link
                  href="/how-to-play"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
                >
                  How to Play
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-150"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center -ml-1 sm:ml-0">
            <img
              src="/logo.svg"
              alt="Game Logo"
              className="h-18 sm:h-16 md:h-20 lg:h-28 xl:h-52 w-auto translate-y-4"
            />
          </Link>
        </div>

        {/* Right-side icon buttons */}
        <div className="flex items-center space-x-3">
          {/* Stats Button */}
          <Button
            onClick={onStatsClick}
            className="stats-button group bg-white border border-[#3B82F6] px-2 py-1 rounded hover:bg-[#3B82F6] hover:text-white transition"
            title="Your Stats"
            aria-label="Your Stats"
          >
            <PieChartIcon className="w-6 h-6 text-[#3B82F6] group-hover:text-white transition" />
          </Button>

{/* Achievements Button */}
<Button
  onClick={onAchievementsClick}
  className="stats-button group bg-white border border-[#3B82F6] px-2 py-1 rounded hover:bg-[#3B82F6] hover:text-white transition"
  title="Achievements"
  aria-label="Achievements"
>
  <Trophy size={20} className="text-[#3B82F6] group-hover:text-white transition" />
</Button>

        </div>
      </div>
    </header>
  );
}
