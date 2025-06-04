// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

function flagEmoji(code) {
  if (!code) return "🌐";
  const cc = code.toUpperCase();
  return cc.replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
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
        setLoading(false);
        return;
      }

      // 🧪 Add mock data here for testing
      const mockEntries = [
        { nickname: "Alice", guess_count: 1, country_code: "us" },
        { nickname: "Bob", guess_count: 2, country_code: "gb" },
        { nickname: "Chloe", guess_count: 1, country_code: "fr" },
        { nickname: "Diego", guess_count: 3, country_code: "es" },
        { nickname: "Eva", guess_count: 2, country_code: "de" },
      ];

      const combined = [...data, ...mockEntries];

      // 🧠 Sort combined entries by guess count ascending
      combined.sort((a, b) => a.guess_count - b.guess_count);

      setEntries(combined);
      setLoading(false);
    }

    fetchLeaderboard();
  }, [puzzleDate]);

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
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            {entries.map((entry, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="font-bold">{i + 1}.</span>
                <span>{flagEmoji(entry.country_code)}</span>
                <span className="font-medium">{entry.nickname}</span> —{" "}
                {entry.guess_count} {entry.guess_count === 1 ? "guess" : "guesses"}
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}
