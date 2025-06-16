'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch this week’s entries
  useEffect(() => {
    async function fetchLeaderboard() {
      const today = new Date();
      const dow = today.getDay();
      today.setDate(today.getDate() - dow);
      const startOfWeek = today.toISOString().slice(0, 10);

      const { data, error } = await supabase.rpc('weekly_leaderboard', {
        start_date: startOfWeek,
      });
      if (error) console.error(error);
      else setEntries(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  return (
    <>
      {/* 1) Menu bar */}
      <Header />

      {/* 2) Outer grey background & centering */}
      <div className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-8 bg-gray-50 min-h-screen">
        {/* 3) White card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            This Week’s Top Players
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-gray-500">No scores yet.</p>
          ) : (
            <ol className="space-y-2 text-sm">
              {entries.slice(0, 10).map((e, i) => (
                <li
                  key={e.device_id}
                  className="flex justify-between px-4 py-2 bg-gray-100 rounded"
                >
                  <span>
                    {i + 1}. {e.nickname}
                  </span>
                  <span>
                    {e.total_score} pts · {e.solves}{' '}
                    {e.solves === 1 ? 'solve' : 'solves'}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {/* 4) Back home link */}
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

      {/* 5) Footer */}
      <Footer />
    </>
  );
}
