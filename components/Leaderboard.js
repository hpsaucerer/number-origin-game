// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leaderboard({ puzzleDate }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("nickname, guess_count")
        .eq("puzzle_date", puzzleDate)
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

  if (loading) {
    return <p className="text-sm text-gray-500 mt-4">Loading leaderboard…</p>;
  }

  if (entries.length === 0) {
    return <p className="text-sm text-gray-500 mt-4">No scores submitted yet.</p>;
  }

  return (
    <div className="mt-6 w-full max-w-sm mx-auto border rounded-md shadow px-4 py-3 bg-white">
      <h2 className="text-lg font-bold mb-2 text-center text-blue-600">🏆 Top Solvers Today</h2>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        {entries.map((entry, i) => (
          <li key={i}>
            <span className="font-medium">{entry.nickname}</span> —{" "}
            {entry.guess_count} {entry.guess_count === 1 ? "guess" : "guesses"}
          </li>
        ))}
      </ol>
    </div>
  );
}
