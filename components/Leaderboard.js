// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
  const deviceId =
    typeof window !== "undefined" ? localStorage.getItem("device_id") : null;

  const [entries, setEntries] = useState([]);
  const [resetCountdown, setResetCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [scoringOpen, setScoringOpen] = useState(false);

  // Countdown until next Sunday midnight (days/h/m/s)
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

  // Fetch this week’s entries
  useEffect(() => {
    async function fetchLeaderboard() {
      const today = new Date();
      const dow = today.getDay();
      today.setDate(today.getDate() - dow);
      const startOfWeek = today.toISOString().slice(0, 10);

      const { data, error } = await supabase.rpc("weekly_leaderboard", {
        start_date: startOfWeek,
      });

      if (error) console.error("❌ Error fetching leaderboard:", error);
      else setEntries(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const getRowClass = (rank) => {
    if (rank === 0) return "bg-yellow-100";
    if (rank === 1) return "bg-gray-100";
    if (rank === 2) return "bg-orange-100";
    return "";
  };

  // Top 10 plus your rank if outside
  const topEntries = entries.slice(0, 10);
  const myIndex = entries.findIndex((e) => e.device_id === deviceId);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-5 overflow-visible">
        {/* header with tooltip */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-blue-600">
              🏆 This Week’s Top Players
            </h2>
            <Tooltip
              open={scoringOpen}
              onOpenChange={setScoringOpen}
              delayDuration={0}
              skipDelayDuration={0}
            >
              <TooltipTrigger asChild>
                <button
                  aria-label="Scoring Explained"
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setScoringOpen(true)}
                >
                  <Info className="w-5 h-5 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                sideOffset={6}
                collisionPadding={{ left: 8, right: 8 }}
                className="z-50 max-w-xs space-y-2 p-2"
              >
                <h3 className="font-semibold text-sm">Scoring Explained</h3>
                <p className="text-xs leading-snug">
                  <strong>Guess pts:</strong><br />
                  1st = 50 • 2nd = 30 • 3rd = 20 • 4th = 10
                </p>
                <p className="text-xs leading-snug">
                  <strong>Time bonus:</strong><br />
                  ≤100 s = 100 • ≤200 s = 70 • ≤300 s = 50 • ≤600 s = 30 • else = 10
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
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
            <p className="text-xs text-yellow-700 mb-4">
              Leaderboard is currently in beta – thanks for testing!
            </p>
            <ol className="pl-5 space-y-1 text-sm">
              {topEntries.map((entry, i) => (
                <li
                  key={entry.device_id}
                  className={`rounded px-3 py-1 flex items-center justify-between ${getRowClass(
                    i
                  )}`}
                >
                  <div className="flex items-center space-x-2">
                    {/* 🇺🇸 Emoji flag */}
                    <span
                      role="img"
                      aria-label={entry.country_code}
                      className="text-xl"
                      style={{
                        fontFamily:
                          "Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, NotoColorEmoji, ui-sans-serif, system-ui, sans-serif",
                      }}
                    >
                      {getFlagEmoji(entry.country_code)}
                    </span>
                    <span className="font-bold">{i + 1}.</span>
                    <span className="font-medium">{entry.nickname}</span>
                  </div>
                  <span className="text-gray-600">
                    {entry.total_score} pts · {entry.solves}{" "}
                    {entry.solves === 1 ? "solve" : "solves"}
                  </span>
                </li>
              ))}
            </ol>
            {myRank > 10 && (
              <p className="mt-3 text-sm text-gray-600">
                Your rank: #{myRank} — {entries[myIndex].total_score} pts ·{" "}
                {entries[myIndex].solves}{" "}
                {entries[myIndex].solves === 1 ? "solve" : "solves"}
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
