// components/ui/header.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";
import PieChartIcon from "@/components/icons/PieChartIcon";

export default function Header({ onStatsClick, onAchievementsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // On mount, if they've never seen it, show the badge
  useEffect(() => {
    if (!localStorage.getItem("seenLeaderboardBadge")) {
      setShowBadge(true);
    }
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen((o) => !o);
  };

  return (
    <header>
      <div className="bg-[#3B82F6] px-4 py-2 flex items-center justify-between h-16 max-w-screen-lg w-full mx-auto">
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex items-start">
            <button
              onClick={handleMenuToggle}
              className="relative text-white text-2xl font-bold px-1 hover:text-blue-200"
              aria-label="Toggle menu"
            >
              ☰
              {showBadge && (
                <span
                  className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"
                  aria-hidden="true"
                />
              )}
            </button>
            {menuOpen && (
              <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg z-50">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  Daily Puzzle
                </Link>
                <Link
                  href="/how-to-play"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  How to Play
                </Link>

                {/* ← HERE is your Leaderboard link; we write the flag only on click */}
                <Link
                  href="/leaderboard"
                  onClick={() => {
                    localStorage.setItem("seenLeaderboardBadge", "true");
                    setShowBadge(false);
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  Leaderboard
                  {showBadge && (
                    <span className="ml-2 text-xs font-semibold text-red-600">
                      NEW
                    </span>
                  )}
                </Link>

                <Link
                  href="/archives"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  Archive Puzzles
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  About
                </Link>
                <Link
                  href="/community"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  Community
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                >
                  Contact
                </Link>
              </div>
            )}
          </div>
          {/* Logo */}
          <Link href="/" className="flex items-center ml-1 sm:ml-0">
            <img
              src="/logo.svg"
              alt="Game Logo"
              className="h-[164px] sm:h-[144px] md:h-20 lg:h-28 xl:h-52 w-auto translate-y-3"
            />
          </Link>
        </div>

        {/* Right-side icon buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onStatsClick}
            className="p-2 text-white hover:text-blue-200"
            title="Your Stats"
            aria-label="Your Stats"
          >
            <PieChartIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onAchievementsClick}
            className="p-2 text-white hover:text-blue-200"
            title="Achievements"
            aria-label="Achievements"
          >
            <Trophy className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
