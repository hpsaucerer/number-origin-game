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

  if (!device_id) {
    console.warn("🚫 No device_id found in cookies. Skipping archive access.");
    return { redirect: { destination: "/archives", permanent: false } };
  }

  // 🔍 Check for valid archive token
  const { data: token, error: tokenError } = await supabase
    .from("archive_tokens")
    .select("*")
    .eq("device_id", device_id)
    .eq("puzzle_number", parseInt(puzzle_number))
    .eq("used", false)
    .maybeSingle();

  if (tokenError || !token) {
    console.warn("⚠️ No valid archive token found.");
    return { redirect: { destination: "/archives", permanent: false } };
  }

  // ✅ Mark token as used
  await supabase
    .from("archive_tokens")
    .update({ used: true, used_at: new Date().toISOString() })
    .eq("id", token.id);

  // 🧩 Load puzzle content
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
