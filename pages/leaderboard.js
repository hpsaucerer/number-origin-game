// pages/leaderboard.js
import Head from 'next/head'
import Leaderboard from '@/components/Leaderboard'  // adjust path if needed

export default function LeaderboardPage() {
  return (
    <>
      <Head>
        <title>Numerus Weekly Leaderboard</title>
      </Head>

      {/* You can wrap in your site’s layout component if you have one */}
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Leaderboard onClose={() => {/* maybe router.back() or noop */}} />
      </main>
    </>
  )
}
