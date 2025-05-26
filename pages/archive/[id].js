import { supabase } from "@/lib/supabase";
import Home from "../index";
import cookie from "cookie";

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  // ✅ Parse device_id from cookie manually
  const cookies = cookie.parse(context.req.headers.cookie || "");
  const device_id = cookies.device_id;

  // REDEEM ARCHIVE TOKEN
  const redeemRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/redeem-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_id, puzzle_id: parseInt(id) })
  });

  if (!redeemRes.ok) {
    return { redirect: { destination: "/archive", permanent: false } };
  }

  // Proceed to fetch puzzle
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

export default function ArchivePage(props) {
  return <Home {...props} />;
}
