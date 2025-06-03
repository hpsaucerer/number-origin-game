// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function Leaderboard({ puzzleId, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("nickname, guess_count")
        .eq("puzzle_date", puzzleId)
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
  }, [puzzleId]);

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
              <li key={i}>
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
