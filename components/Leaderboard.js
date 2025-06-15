// components/Leaderboard.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Logo from "@/public/leaderboard.png";

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

  // Countdown until next Sunday midnight
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

  // Fetch this week’s entries via RPC
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

  const topEntries = entries.slice(0, 10);
  const myIndex = entries.findIndex((e) => e.device_id === deviceId);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-5 overflow-visible">
        {/* ─── centered logo & subtitle with tooltip 'i' top-left and dismiss 'X' top-right ─── */}
        <div className="relative mb-4">
          <div className="flex flex-col items-center space-y-0.5">
            <img
              src="/leaderboard.png"
              alt="Numerus Leaderboard"
              className="h-16 w-auto mb-1"
            />
            <h2 className="text-sm font-semibold text-blue-600">
              This Week’s Top Players
            </h2>
          </div>

{/* tooltip in top-left */}
<div className="absolute top-2 left-2">
    <Tooltip
    open={scoringOpen}
    onOpenChange={setScoringOpen}
    delayDuration={0}
    skipDelayDuration={0}
  >
 <TooltipTrigger asChild>
   <button
     aria-label="Scoring Explained"
     className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
     onClick={() => setScoringOpen((prev) => !prev)}  // toggle tooltip on tap
     onBlur={() => setScoringOpen(false)}             // close when focus leaves
   >
     <Info className="w-6 h-6 text-blue-600" />
   </button>
 </TooltipTrigger>
    <TooltipContent
      side="bottom"
      align="center"
      sideOffset={6}
      collisionPadding={{ left: 8, right: 8 }}
      className="z-50 max-w-xs space-y-2 p-3 bg-white text-black rounded-lg shadow"
    >
  <div className="space-y-2">
    <h3 className="font-semibold text-sm">Scoring Explained</h3>

    {/* Guess points */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
      <div className="font-semibold col-span-2">Guess pts:</div>
      <div>1st</div>
      <div className="font-medium">50</div>
      <div>2nd</div>
      <div className="font-medium">30</div>
      <div>3rd</div>
      <div className="font-medium">20</div>
      <div>4th</div>
      <div className="font-medium">10</div>
    </div>

    {/* Time bonus */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
      <div className="font-semibold col-span-2">Time bonus:</div>
      <div>≤ 100 s</div>
      <div className="font-medium">100</div>
      <div>≤ 200 s</div>
      <div className="font-medium">70</div>
      <div>≤ 300 s</div>
      <div className="font-medium">50</div>
      <div>≤ 600 s</div>
      <div className="font-medium">30</div>
      <div>All other times</div>
      <div className="font-medium">10</div>
    </div>
  </div>
</TooltipContent>

  </Tooltip>
</div>

          {/* dismiss 'X' in top-right */}
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              aria-label="Close leaderboard"
              className="text-blue-600 hover:text-blue-800"
            >
              <X size={20} />
            </button>
          </div>
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
                    {/* Native flag emoji */}
                    <span
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
