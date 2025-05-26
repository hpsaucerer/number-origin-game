export async function getServerSideProps(context) {
  const { id } = context.params;

  const cookies = cookie.parse(context.req.headers.cookie || "");
  const device_id = cookies.device_id;

  // ✅ Construct absolute URL safely
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  // ✅ REDEEM ARCHIVE TOKEN
  const redeemRes = await fetch(`${baseUrl}/api/redeem-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_id, puzzle_id: parseInt(id) })
  });

  if (!redeemRes.ok) {
    return { redirect: { destination: "/archive", permanent: false } };
  }

  // ✅ Fetch puzzle
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("date", { ascending: true });

  if (error || !data) return { notFound: true };

  const sorted = data.filter(p => p.date).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const puzzleIndex = sorted.findIndex(
    (p) => p.puzzle_number?.toString() === id
  );

  const puzzle = sorted[puzzleIndex];
  if (!puzzle) return { notFound: true };

  return {
    props: {
      overridePuzzle: puzzle,
      isArchive: true,
      archiveIndex: puzzle.puzzle_number,
    },
  };
}
