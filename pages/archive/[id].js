import { fetchAllPuzzles } from "@/lib/api";
import Home from "../index";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const all = await fetchAllPuzzles();

  // Sort chronologically by date (important for archiveIndex to match display order)
  const sorted = all
    .filter((p) => p.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Match on puzzle_number instead of ID
  const puzzleIndex = sorted.findIndex((p) => p.puzzle_number?.toString() === id);
  const puzzle = sorted[puzzleIndex];

  if (!puzzle) {
    return { notFound: true };
  }

  return {
    props: {
      overridePuzzle: puzzle,
      isArchive: true,
      archiveIndex: puzzle.puzzle_number, // ✅ Accurate display as Numerus #
    },
  };
}

export default function ArchivePage(props) {
  return <Home {...props} />;
}
