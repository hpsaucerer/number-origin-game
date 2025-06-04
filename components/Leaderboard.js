// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map(char => 0x1f1e6 + char.charCodeAt(0) - 65)
  );
}

export default function Leaderboard({ puzzleDate, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!puzzleDate || isNaN(new Date(puzzleDate))) return;

      const normalizedDate = new Date(puzzleDate).toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("nickname, guess_count, country_code")
        .eq("puzzle_date", normalizedDate)
        .eq("is_correct", true)
        .order("guess_count", { ascending: true })
        .limit(25);

      if (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } else {
        setEntries(data);
      }

      setLoading(false);
    }

    fetchLeaderboard();
  }, [puzzleDate]);

  const getRowClass = (rank) => {
    switch (rank) {
      case 0: return "bg-yellow-100";
      case 1: return "bg-gray-100";
      case 2: return "bg-orange-100";
      default: return "";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blue-600">🏆 Top Solvers Today</h2>
          <button onClick={onClose} aria-label="Close leaderboard">
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading leaderboard…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">No scores submitted yet.</p>
        ) : (
          <ol className="pl-5 space-y-1 text-sm">
            {entries.map((entry, i) => (
              <li
                key={i}
                className={`rounded px-3 py-1 flex items-center justify-between ${getRowClass(i)}`}
              >
                <div>
                  <span className="font-bold">{i + 1}.</span>{" "}
                  <span className="mr-2">{getFlagEmoji(entry.country_code)}</span>
                  <span className="font-medium">{entry.nickname}</span>
                </div>
                <span className="text-gray-600">
                  {entry.guess_count} {entry.guess_count === 1 ? "guess" : "guesses"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}
