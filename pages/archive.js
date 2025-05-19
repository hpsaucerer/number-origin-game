import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import puzzles from "../data/puzzles";
import { format } from "date-fns";

function isToday(dateStr) {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

export default function Archive() {
  const [available, setAvailable] = useState([]);
  const [allowed, setAllowed] = useState(false);
  const [checkedToken, setCheckedToken] = useState(false); // ✅ NEW
  const router = useRouter();

  useEffect(() => {
    // ✅ Wait for browser context (important for SSR or static builds)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("archiveToken");
      if (token === "1") {
        setAllowed(true);
        const today = new Date().toISOString().split("T")[0];
        const filtered = puzzles.filter(p => p.date !== today);
        setAvailable(filtered);
      } else {
        router.push("/"); // ⛔ Redirect if no token
      }
      setCheckedToken(true); // ✅ Only mark check complete once logic runs
    }
  }, []);

  const handleSelect = (id) => {
    localStorage.removeItem("archiveToken");
    localStorage.setItem("lastPlayedArchive", id.toString()); // optional tracking
    router.push(`/archive/${id}`);
  };

  if (!checkedToken) return null; // ✅ wait for token check to finish
  if (!allowed) return null;      // ✅ don't render unless verified

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
            onClick={() => handleSelect(puzzle.id)}
            className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 text-left transition"
          >
            <p className="text-lg font-semibold">#{puzzle.id}</p>
            <p className="text-gray-700">
              {puzzle.formatted || puzzle.number}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(puzzle.date), "MMMM d, yyyy")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
