import { useEffect } from "react";
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

  // 🔍 Check for valid archive token (generic or targeted)
const { data: tokens, error: tokenError } = await supabase
  .from("ArchiveTokens")
  .select("*")
  .eq("device_id", device_id)
  .eq("used", false);

if (tokenError || !tokens || tokens.length === 0) {
  console.warn("⚠️ No tokens available.");
  return { redirect: { destination: "/archives", permanent: false } };
}

// Find a token that matches this puzzle or is generic
const usableToken = tokens.find(
  (t) =>
    !t.puzzle_number ||
    parseInt(t.puzzle_number) === parseInt(puzzle_number)
);

if (!usableToken) {
  console.warn("⚠️ No usable token for this puzzle.");
  return { redirect: { destination: "/archives", permanent: false } };
}

  // ✅ Mark token as used and optionally link to this puzzle
await supabase
  .from("ArchiveTokens")
  .update({
    used: true,
    used_at: new Date().toISOString(),
    puzzle_number: parseInt(puzzle_number),
  })
  .eq("id", usableToken.id);


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
  // ✅ Set archiveTokenUsed only after successful load
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("archiveTokenUsed", "true");
    }
  }, []);

  return <Home {...props} />;
}
