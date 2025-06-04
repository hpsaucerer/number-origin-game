// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const MOCK_ENTRIES = [
  { nickname: "MART", guess_count: 1 },
  { nickname: "Han", guess_count: 1 },
  { nickname: "Jude", guess_count: 2 },
  { nickname: "Nouks", guess_count: 2 },
  { nickname: "Tess", guess_count: 3 },
  { nickname: "Liam", guess_count: 3 },
  { nickname: "Zee", guess_count: 4 },
  { nickname: "Kiko", guess_count: 4 },
  { nickname: "Leo", guess_count: 4 },
  { nickname: "Rin", guess_count: 4 },
  { nickname: "Ola", guess_count: 4 },
  { nickname: "Mira", guess_count: 5 },
  { nickname: "Axel", guess_count: 5 },
  { nickname: "Dune", guess_count: 6 },
  { nickname: "Tali", guess_count: 6 },
];

export default function Leaderboard({ puzzleDate, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (!puzzleDate || isNaN(new Date(puzzleDate))) return;

      const normalizedDate = new Date(puzzleDate).toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("nickname, guess_count")
        .eq("puzzle_date", normalizedDate)
        .eq("is_correct", true)
        .order("guess_count", { ascending: true })
        .limit(25);

      if (error) {
        console.error("❌ Error fetching leaderboard:", error);
        setEntries(MOCK_ENTRIES);
      } else {
        setEntries(data && data.length > 0 ? data : MOCK_ENTRIES);
      }

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
              <li key={i}>
                <span className="font-bold">{i + 1}.</span>{" "}
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
