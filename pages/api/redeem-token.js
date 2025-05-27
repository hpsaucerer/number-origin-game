import { supabase } from "@/lib/supabase";
import Home from "../index";
import cookie from "cookie";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const cookies = cookie.parse(context.req.headers.cookie || "");
  const rawDeviceId = cookies.device_id;
  const device_id = rawDeviceId?.trim().toLowerCase();

  console.log("📦 Received cookies:", cookies);
  console.log("📦 Normalized device_id:", device_id);

  const baseUrl = context.req.headers.host.startsWith("localhost")
    ? "http://localhost:3000"
    : `https://${context.req.headers.host}`;

  let resolvedPuzzleId = null;

  // 🧠 Step 1: Resolve puzzle_number to internal puzzle.id
  const { data: allPuzzles, error: puzzleError } = await supabase
    .from("puzzles")
    .select("*")
    .order("date", { ascending: true });

  if (puzzleError || !allPuzzles) {
    console.error("❌ Error fetching puzzles:", puzzleError?.message);
    return { notFound: true };
  }

  const sorted = allPuzzles.filter(p => p.date).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const puzzleIndex = sorted.findIndex(p => p.puzzle_number?.toString() === id);
  const puzzle = sorted[puzzleIndex];

  if (!puzzle) {
    console.warn("⚠️ No puzzle found for puzzle_number:", id);
    return { notFound: true };
  }

  resolvedPuzzleId = puzzle.id;

  // 🔁 Step 2: Attempt token redemption
  if (device_id && resolvedPuzzleId) {
    try {
      console.log("🌐 Redeeming token for:", device_id, "→ puzzle_number:", id);
      const redeemRes = await fetch(`${baseUrl}/api/redeem-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vercel-protection-bypass": "1",
        },
        body: JSON.stringify({
          device_id,
          puzzle_number: id, // ✅ use puzzle_number for token match
        }),
      });

      const contentType = redeemRes.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await redeemRes.json();
        console.log("🔁 Redemption response:", data);

        if (!redeemRes.ok || !data.success) {
          console.warn("⚠️ Redemption failed with response:", data);
        }
      } else {
        console.warn("⚠️ Unexpected response format:", contentType);
      }
    } catch (err) {
      console.error("❌ Redemption fetch threw error:", err.message);
    }
  } else {
    console.warn("⚠️ No device_id or resolvedPuzzleId — skipping redemption.");
  }

  // ✅ Step 3: Return props for rendering
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
