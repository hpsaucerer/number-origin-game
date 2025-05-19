import { fetchAllPuzzles } from "@/lib/api";
import Home from "../index";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const all = await fetchAllPuzzles();

  // Sort chronologically by date
  const sorted = all
    .filter((p) => p.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const puzzleIndex = sorted.findIndex((p) => p.puzzle_number.toString() === id);
  const puzzle = sorted[puzzleIndex];

  if (!puzzle) {
    return { notFound: true };
  }

  return {
    props: {
      overridePuzzle: puzzle,
      isArchive: true,
      archiveIndex: puzzleIndex + 1, // Numerus #1 is first
    },
  };
}

export default function ArchivePage(props) {
  return <Home {...props} />;
}
