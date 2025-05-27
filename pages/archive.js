import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { getOrCreateDeviceId } from "@/lib/device";

export default function Archive() {
  const [available, setAvailable] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hasGranted = localStorage.getItem("firstTokenGranted") === "true";
    const completed = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");

    if (!hasGranted && completed.length === 0) {
      const deviceId = getOrCreateDeviceId();

      // ✅ Set cookie for SSR
      document.cookie = `device_id=${deviceId}; path=/; max-age=31536000`;

      fetch("/api/redeem-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: deviceId,
          source: "archive_visit_bonus"
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log("✅ Archive token granted via archive visit");
            localStorage.setItem("firstTokenGranted", "true");
          }
        });
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const today = new Date().toISOString().split("T")[0];

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
      <h1 className="text-2xl font-bold mb-4 text-center">Pick an Archive Puzzle</h1>
      <p className="text-gray-600 text-center mb-6">
        You've unlocked an extra puzzle — pick any past number to play again!
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {available.map((puzzle) => (
          <button
            key={puzzle.id}
            onClick={() => {
              if (!puzzle?.puzzle_number) {
                console.error("❌ Missing puzzle number:", puzzle);
                return;
              }

              const deviceId = getOrCreateDeviceId();

              // ✅ Ensure cookie is available to SSR
              document.cookie = `device_id=${deviceId}; path=/; max-age=31536000`;

              console.log("🧪 Navigating to archive:", puzzle.puzzle_number);
              console.log("🧪 Current device_id cookie:", document.cookie);

              // 👇 Slight delay to ensure cookie is set before SSR
              setTimeout(() => {
                router.push(`/archive/${puzzle.puzzle_number}`);
              }, 50);
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
