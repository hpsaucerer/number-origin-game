import { supabase } from "@/lib/supabase";
import Home from "../index";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("date", { ascending: true });

  if (error || !data) {
    console.error("❌ Supabase fetch error:", error?.message || "No data");
    return { notFound: true };
  }

  // Sort by date to establish archive order
  const sorted = data.filter(p => p.date).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const puzzleIndex = sorted.findIndex(
    (p) => p.puzzle_number?.toString() === id
  );

  const puzzle = sorted[puzzleIndex];

  if (!puzzle) {
    return { notFound: true };
  }

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
