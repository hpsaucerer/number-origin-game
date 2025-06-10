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

export default function Leaderboard({ onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      // calculate this week's start (Sunday)
      const today = new Date();
      const dow   = today.getDay();      // 0 = Sunday
      today.setDate(today.getDate() - dow);
      const startOfWeek = today.toISOString().slice(0,10);

      const { data, error } = await supabase
        .rpc("weekly_leaderboard", { start_date: startOfWeek });

      if (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } else {
        setEntries(data);
      }

      setLoading(false);
    }

    fetchLeaderboard();
  }, []);  // weekly, so no dependencies

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
          <h2 className="text-lg font-bold text-blue-600">🏆 This Week’s Top Players</h2>
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
                <div className="flex items-center space-x-2">
<span
  className="text-xl bg-red-200"  
  style={{
    // emoji fonts first, then fallback to your UI font
    fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, NotoColorEmoji, ui-sans-serif, system-ui, sans-serif'
  }}
>
  {getFlagEmoji(entry.country_code)}
</span>
                  <span className="font-bold">{i + 1}.</span>
                  <span className="font-medium">{entry.nickname}</span>
                </div>
                <span className="text-gray-600">
                  {entry.total_score} pts · {entry.solves}{" "}
                  {entry.solves === 1 ? "solve" : "solves"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}
