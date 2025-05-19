import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase"; // adjust path if needed

export default function Archive() {
  const [available, setAvailable] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Ensure client-side
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const today = new Date().toISOString().split("T")[0];
    const token = localStorage.getItem("archiveToken");

    if (token !== today) {
      router.replace("/");
      return;
    }

    const fetchPuzzles = async () => {
      const { data, error } = await supabase
        .from("puzzles")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("❌ Error fetching puzzles:", error.message);
        router.replace("/");
        return;
      }

      const filtered = data.filter(p => p.date && p.date < today);
      setAvailable(filtered);
      setAllowed(true);
    };

    fetchPuzzles();
  }, [mounted]);

  if (!mounted || !allowed) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Pick an Archive Puzzle
      </h1>
      <p className="text-gray-600 text-center mb-6">
        You've unlocked an extra puzzle — pick any past number to play again!
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {available.map((puzzle) => (
          <button
            key={puzzle.id}
            onClick={() => {
              const puzzleNumber = puzzle?.puzzle_number;
              if (!puzzleNumber || isNaN(Number(puzzleNumber))) {
                console.error("❌ Invalid puzzle_number:", puzzle);
                return;
              }

              localStorage.setItem("lastPlayedArchive", puzzleNumber.toString());

              router.push(`/archive/${puzzleNumber}`).then(() => {
                localStorage.removeItem("archiveToken");
              });
            }}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 text-left transition"
          >
            <p className="text-lg font-semibold">Numerus #{puzzle.puzzle_number}</p>
            <p className="text-gray-700">{puzzle.number}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(puzzle.date), "MMMM d, yyyy")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
