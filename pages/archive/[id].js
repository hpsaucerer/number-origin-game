import Home from "../index";
import { fetchAllPuzzles } from "@/lib/api"; // or import puzzles from "../../data/puzzles";

export async function getServerSideProps(context) {
  const { id } = context.params;

  const all = await fetchAllPuzzles(); // or use your local `puzzles` array
  const puzzle = all.find((p) => p.id.toString() === id);

  if (!puzzle) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      overridePuzzle: puzzle,
      isArchive: true,
    },
  };
}

export default function ArchivePage(props) {
  return <Home {...props} />;
}
