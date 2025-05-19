import { fetchAllPuzzles } from "@/lib/api";
import Home from "../index";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const all = await fetchAllPuzzles();

  // Sort by puzzle_number ascending to ensure correct indexing
  const sorted = all
    .filter((p) => typeof p.puzzle_number === "number")
    .sort((a, b) => a.puzzle_number - b.puzzle_number);

  const puzzleIndex = sorted.findIndex((p) => p.puzzle_number?.toString() === id);
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
