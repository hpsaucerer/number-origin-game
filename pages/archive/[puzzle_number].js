import { supabase } from "@/lib/supabase";
import Home from "../index";
import cookie from "cookie";

export async function getServerSideProps(context) {
  const { puzzle_number } = context.params;

  const cookies = cookie.parse(context.req.headers.cookie || "");
  const rawDeviceId = cookies.device_id;
  const device_id = rawDeviceId?.trim().toLowerCase();

  console.log("📦 Received cookies:", cookies);
  console.log("📦 Normalized device_id:", device_id);

  const payload = {
    device_id: device_id || "MISSING",
    puzzle_number: parseInt(puzzle_number),
  };

  if (!device_id) {
    console.warn("🚫 No device_id found in cookies. Skipping token redemption.");
  } else {
    try {
      console.log("📦 archive [puzzle_number] - token redemption payload:", payload);

     const apiUrl = `${process.env.INTERNAL_API_URL?.trim().replace(/\/$/, "")}/api/redeem-token`;

      console.log("🌐 Calling token redemption on:", apiUrl);

      const redeemRes = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = redeemRes.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        data = await redeemRes.json();
      } else {
        console.error("❌ Unexpected response type:", contentType);
        return { redirect: { destination: "/archives", permanent: false } };
      }

      console.log("📨 Token redemption response:", data);

      if (!redeemRes.ok) {
        console.warn("⚠️ Token redemption failed:", redeemRes.status);
        return { redirect: { destination: "/archives", permanent: false } };
      }
    } catch (err) {
      console.error("❌ Token redemption threw error:", err.message);
      return { redirect: { destination: "/archives", permanent: false } };
    }
  }

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("puzzle_number", puzzle_number)
    .single();

  if (error || !data) {
    console.error("❌ Puzzle not found for puzzle_number:", puzzle_number);
    return { notFound: true };
  }

  return {
    props: {
      overridePuzzle: data,
      isArchive: true,
      archiveIndex: data.puzzle_number,
    },
  };
}

export default function ArchivePuzzlePage(props) {
  return <Home {...props} />;
}
