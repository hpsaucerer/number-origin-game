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

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://number-origin-game.vercel.app"; // Replace with your Vercel domain if different

  const payload = {
    device_id: device_id || "MISSING",
    puzzle_id: parseInt(id),
  };

  if (!device_id) {
    console.warn("🚫 No device_id found in cookies. Skipping token redemption.");
  } else {
    try {
      console.log("📦 archive [id] - token redemption payload:", payload);
      const redeemRes = await fetch(`${baseUrl}/api/redeem-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-vercel-protection-bypass": "1",
        },
        body: JSON.stringify(payload),
      });

      const contentType = redeemRes.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await redeemRes.json();
      } else {
        console.error("❌ Unexpected response type:", contentType);
        return { redirect: { destination: "/archive", permanent: false } };
      }

      console.log("📨 Token redemption response:", data);

      if (!redeemRes.ok) {
        console.warn("⚠️ Token redemption failed:", redeemRes.status);
        return { redirect: { destination: "/archive", permanent: false } };
      }
    } catch (err) {
      console.error("❌ Token redemption threw error:", err.message);
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
