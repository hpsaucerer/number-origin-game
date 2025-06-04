import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import cookie from "cookie";

// 🧠 Dynamically import Home with SSR disabled
const Home = dynamic(() => import("../index"), { ssr: false });

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

  const { data: token, error: tokenError } = await supabase
    .from("ArchiveTokens")
    .select("*")
    .eq("device_id", device_id)
    .eq("used", false)
    .maybeSingle();

  const isTokenValid =
    token &&
    (!token.puzzle_number || parseInt(token.puzzle_number) === parseInt(puzzle_number));

  if (tokenError || !isTokenValid) {
    console.warn("⚠️ No valid archive token found.");
    return { redirect: { destination: "/archives", permanent: false } };
  }

  await supabase
    .from("ArchiveTokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      puzzle_number: parseInt(puzzle_number),
    })
    .eq("id", token.id);

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

// ✅ Only run this browser-side
function ArchiveTracker() {
  useEffect(() => {
    localStorage.setItem("archiveTokenUsed", "true");
  }, []);
  return null;
}

export default function ArchivePuzzlePage(props) {
  return (
    <>
      <ArchiveTracker />
      <Home {...props} />
    </>
  );
}
