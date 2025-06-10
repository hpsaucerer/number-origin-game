// pages/api/weekly-leaderboard.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL,
  process.env.SUPA_SERVICE_ROLE_KEY   // needs RPC privileges
);

export default async function handler(req, res) {
  // compute Sunday of this week (or whatever your week boundary is)
  const today = new Date();
  const dow   = today.getDay();           // 0 = Sunday
  today.setDate(today.getDate() - dow);
  const iso = today.toISOString().slice(0,10);

  const { data, error } = await supabase
    .rpc('weekly_leaderboard', { start_date: iso });

  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
}
