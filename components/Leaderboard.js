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
      .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65)
  );
}

export default function Leaderboard({ onClose }) {
  // 1) Read stored device ID (avoid SSR issues)
  const deviceId =
    typeof window !== "undefined" ? localStorage.getItem("device_id") : null;

  const [entries, setEntries] = useState([]);
  const [resetCountdown, setResetCountdown] = useState("");
  const [loading, setLoading] = useState(true);

  // Compute countdown to next weekly reset (Sunday midnight)
  useEffect(() => {
    const updateReset = () => {
      const now = Date.now();
      const d = new Date(now);
      const daysUntilSunday = (7 - d.getUTCDay()) % 7;
      d.setDate(d.getDate() + daysUntilSunday);
      d.setHours(24, 0, 0, 0);
      const diff = d.getTime() - now;

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      let str = "";
      if (days) str += `${days}d `;
      str += `${hours}h ${mins}m ${secs}s`;
      setResetCountdown(str);
    };

    updateReset();
    const id = setInterval(updateReset, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch weekly leaderboard entries
  useEffect(() => {
    async function fetchLeaderboard() {
      const today = new Date();
      const dow = today.getDay();
      today.setDate(today.getDate() - dow);
      const startOfWeek = today.toISOString().slice(0, 10);

      const { data, error } = await supabase.rpc("weekly_leaderboard", {
        start_date: startOfWeek,
      });

      if (error) {
        console.error("❌ Error fetching leaderboard:", error);
      } else {
        setEntries(data);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const getRowClass = (rank) => {
    switch (rank) {
      case 0:
        return "bg-yellow-100";
      case 1:
        return "bg-gray-100";
      case 2:
        return "bg-orange-100";
      default:
        return "";
    }
  };

  // Prepare top 10 and compute this player's rank
  const topEntries = entries.slice(0, 10);
  const myIndex = entries.findIndex((e) => e.device_id === deviceId);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-blue-600">
            🏆 This Week’s Top Players
          </h2>
          <button onClick={onClose} aria-label="Close leaderboard">
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading leaderboard…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">No scores submitted yet.</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">
              Resets in: {resetCountdown}
            </p>
            <ol className="pl-5 space-y-1 text-sm">
              {topEntries.map((entry, i) => (
                <li
                  key={entry.device_id}
                  className={`rounded px-3 py-1 flex items-center justify-between ${getRowClass(i)}`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-xl"
                      style={{
                        fontFamily:
                          'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, NotoColorEmoji, ui-sans-serif, system-ui, sans-serif',
                      }}
                    >
                      {getFlagEmoji(entry.country_code)}
                    </span>
                    <span className="font-bold">{i + 1}.</span>
                    <span className="font-medium">{entry.nickname}</span>
                  </div>
                  <span className="text-gray-600">
                    {entry.total_score} pts · {entry.solves}{" "}
                    {entry.solves === 1 ? "solve" : "solves"}
                  </span>
                </li>
              ))}
            </ol>

            {myRank > 10 && (
              <p className="mt-3 text-sm text-gray-600">
                Your rank: #{myRank} — {entries[myIndex].total_score} pts · {entries[myIndex].solves}{" "}
                {entries[myIndex].solves === 1 ? "solve" : "solves"}
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
