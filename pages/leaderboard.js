// pages/leaderboard.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/Footer';
import { supabase } from '@/lib/supabase';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

function getFlagEmoji(countryCode) {
  if (!countryCode) return '';
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split('')
      .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65)
  );
}

function getThisWeekStartUTC() {
  const now = new Date();
  const day = now.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;
  const monday = new Date(now.getTime() - daysSinceMonday * 86400000);
  return new Date(Date.UTC(
    monday.getUTCFullYear(),
    monday.getUTCMonth(),
    monday.getUTCDate()
  )).toISOString().slice(0, 10);
}

function getResetCountdownUTC() {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilNextMonday = (8 - day) % 7 || 7;
  const nextMonday = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilNextMonday,
    0, 0, 0
  ));
  const diff = nextMonday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60))    / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60))         / 1000);
  return `${days}d ${hours}h ${mins}m ${secs}s`;
}

export default function LeaderboardPage() {
  const [scoringOpen, setScoringOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(getResetCountdownUTC());

  useEffect(() => {
    async function fetchLeaderboard() {
      const start_date = getThisWeekStartUTC();
      const { data, error } = await supabase.rpc('weekly_leaderboard', { start_date });
      if (error) console.error('Error loading leaderboard:', error);
      else setEntries(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCountdown(getResetCountdownUTC()), 1000);
    return () => clearInterval(id);
  }, []);

  const top10 = entries.slice(0, 10);

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8 px-4">
        <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
          
          {/* logo + heading */}
          <div className="flex flex-col items-center mb-3">
            <img
              src="/leaderboard.png"
              alt="Numerus Leaderboard"
              className="h-16 sm:h-24 w-auto mb-0"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              This Week’s Top Players
            </h1>
          </div>

          {/* tooltip */}
           <div className="absolute top-0 left-0">
            <Tooltip
              open={scoringOpen}
              onOpenChange={setScoringOpen}
              delayDuration={0}
              skipDelayDuration={0}
            >
              <TooltipTrigger asChild>
                <button
                  aria-label="Scoring Explained"
                  className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                  onClick={e => {
                    e.stopPropagation()
                    setScoringOpen(open => !open)
                  }}
                >
                  <Info className="w-5 h-5 text-blue-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                sideOffset={6}
                className="z-50 max-w-xs space-y-2 p-3 bg-white text-black rounded-lg shadow"
              >
                {/* … your scoring grids … */}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* reset timer & beta note */}
          <p className="text-center text-sm text-gray-600 mb-1">
            Resets in: {countdown}
          </p>
          <p className="text-center text-xs text-yellow-700 mb-4">
            Leaderboard is currently in beta – thanks for testing!
          </p>

          {/* list */}
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : top10.length === 0 ? (
            <p className="text-center text-gray-500">No scores submitted yet.</p>
          ) : (
            <ol className="space-y-2">
              {top10.map((e, i) => (
                <li
                  key={e.device_id}
                  className={[
                    'flex items-center justify-between px-4 py-2 rounded',
                    i === 0 ? 'bg-yellow-100' :
                    i === 1 ? 'bg-gray-100'  :
                    i === 2 ? 'bg-orange-100': ''
                  ].join(' ')}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getFlagEmoji(e.country_code)}</span>
                    <span className="font-bold">{i + 1}.</span>
                    <span className="font-medium">{e.nickname}</span>
                  </div>
                  <span className="text-gray-600">
                    {e.total_score} pts · {e.solves}{' '}
                    {e.solves === 1 ? 'solve' : 'solves'}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {/* back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
