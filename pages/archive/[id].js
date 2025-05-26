import { supabase } from "@/lib/supabase";
import Home from "../index";
import cookie from "cookie";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const cookies = cookie.parse(context.req.headers.cookie || "");
  const device_id = cookies.device_id;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const payload = {
    device_id: device_id || "MISSING",
    puzzle_id: parseInt(id),
  };

  if (!device_id) {
    console.warn("🚫 No device_id found in cookies. Skipping token redemption.");
  } else {
    console.log("📦 archive [id] - token redemption payload:", payload);
    const redeemRes = await fetch(`${baseUrl}/api/redeem-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!redeemRes.ok) {
      console.warn("⚠️ Token redemption failed:", redeemRes.status);
      return { redirect: { destination: "/archive", permanent: false } };
    }
  }

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("date", { ascending: true });

  if (error || !data) return { notFound: true };

  const sorted = data.filter((p) => p.date).sort(
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
