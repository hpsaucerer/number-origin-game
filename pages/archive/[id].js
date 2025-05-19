import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import puzzles from "../../data/puzzles"; // adjust if your path is different
import Home from "../index"; // or import your main puzzle component if separate

export default function ArchivePuzzlePage() {
  const router = useRouter();
  const { id } = router.query;

  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    if (id && puzzles) {
      const selected = puzzles.find(p => p.id.toString() === id);
      if (selected) {
        setPuzzle(selected);
      } else {
        router.push("/archive"); // fallback if ID is invalid
      }
    }
  }, [id]);

  if (!puzzle) {
    return <p className="text-center py-10">Loading puzzle...</p>;
  }

  return <Home overridePuzzle={puzzle} isArchive={true} />;
}
