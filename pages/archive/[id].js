import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import puzzles from "../../data/puzzles";
import Home from "../index";

export default function ArchivePuzzlePage() {
  const router = useRouter();
  const { id } = router.query;

  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    if (id && puzzles) {
      const selected = puzzles.find(p => {
  if (p?.id == null) return false;
  return p.id.toString() === id;
});
      if (selected) {
        setPuzzle(selected);
      } else {
        router.push("/archive");
      }
    }
  }, [id]);

  // ✅ Track played archive puzzle
  useEffect(() => {
    if (puzzle?.id) {
      const played = JSON.parse(localStorage.getItem("playedArchive") || "[]");
      if (!played.includes(puzzle.id)) {
        localStorage.setItem("playedArchive", JSON.stringify([...played, puzzle.id]));
      }
    }
  }, [puzzle]);

  if (!puzzle) {
    return <p className="text-center py-10">Loading puzzle...</p>;
  }

  return <Home overridePuzzle={puzzle} isArchive={true} />;
}
