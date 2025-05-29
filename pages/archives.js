import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { getOrCreateDeviceId } from "@/lib/device";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/ui/header";
import { useModal } from "@/context/ModalContext"; // ✅ Add modal context
import StatsModal from "@/components/modals/StatsModal"; // ✅ Import the Stats modal component
import useStats from "@/hooks/useStats";

export default function Archive() {
  const [available, setAvailable] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const router = useRouter();

  const { showStatsModal, setShowStatsModal, setShowAchievements } = useModal();
  const stats = useStats(); // ✅ load stats data for modal

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const deviceId = getOrCreateDeviceId();

    const justFinished = localStorage.getItem("justCompletedArchive") === "true";
    const alreadyRewarded = localStorage.getItem("archiveCompletionRewarded") === "true";
    const thankYouShown = localStorage.getItem("archiveThankYouShown") === "true";

    if (justFinished && !thankYouShown) {
      setShowModal(true);
      localStorage.setItem("archiveThankYouShown", "true");
      localStorage.removeItem("justCompletedArchive");

      if (!alreadyRewarded) {
        fetch("/api/grant-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id: deviceId,
            source: "archive_completion_reward"
          }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              localStorage.setItem("archiveCompletionRewarded", "true");
              setRewarded(true);
            }
          })
          .catch((err) => console.error("❌ Reward grant error:", err));
      } else {
        setRewarded(true);
      }
    }

    const hasGranted = localStorage.getItem("firstTokenGranted") === "true";
    const completed = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");

    if (!hasGranted && completed.length === 0) {
      const domain = process.env.NODE_ENV === "production" ? "; domain=.vercel.app" : "";
      document.cookie = `device_id=${deviceId.toLowerCase()}; path=/; max-age=31536000${domain}`;

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
            localStorage.setItem("firstTokenGranted", "true");
          }
        });
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const today = new Date().toISOString().split("T")[0];
    const deviceId = getOrCreateDeviceId();

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

    const fetchTokens = async () => {
      const { data: tokens, error: tokenError } = await supabase
        .from("ArchiveTokens")
        .select("*")
        .eq("device_id", deviceId)
        .eq("used", false);

      if (tokenError) {
        console.error("❌ Error fetching tokens:", tokenError.message);
      } else {
        setTokenCount(tokens.length);
      }
    };

    fetchPuzzles();
    fetchTokens();
  }, [mounted]);

  if (!mounted || !allowed) return null;

  return (
    <>
      <Header
        onStatsClick={() => setShowStatsModal(true)}
        onAchievementsClick={() => setShowAchievements(true)}
      />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to the Archives</h1>

        {tokenCount > 0 && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded mb-4 text-center">
            🪙 You have {tokenCount} unused token{tokenCount > 1 ? "s" : ""} to play an archive puzzle!
          </div>
        )}

        <p className="text-gray-600 text-center mb-6">
          Missed a puzzle? Fear not! Use tokens to replay puzzles and boost your category achievements!
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {available.map((puzzle) => {
            const completedIds = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");
            const isCompleted = completedIds.includes(puzzle.id);

            return (
              <button
                key={puzzle.id}
                onClick={async () => {
                  if (!puzzle?.puzzle_number) {
                    console.error("❌ Missing puzzle_number:", puzzle);
                    return;
                  }

                  const deviceId = getOrCreateDeviceId();
                  const domain = process.env.NODE_ENV === "production" ? "; domain=.vercel.app" : "";
                  document.cookie = `device_id=${deviceId.toLowerCase()}; path=/; max-age=31536000${domain}`;

                  const res = await fetch("/api/check-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      device_id: deviceId,
                      puzzle_number: puzzle.puzzle_number
                    }),
                  });

                  const result = await res.json();

                  if (result.valid) {
                    localStorage.setItem("archiveTokenUsed", "true")
                    router.push(`/archive/${puzzle.puzzle_number}`);
                  } else {
                    alert("🪙 You're out of tokens — but don't worry, you can earn and buy more soon. Watch this space!");
                  }
                }}
                disabled={isCompleted}
                className={`border rounded-lg p-4 text-left transition relative ${
                  isCompleted ? "bg-gray-200 opacity-60 cursor-default" : "bg-white hover:shadow-md"
                }`}
              >
                <p className="text-lg font-semibold">
                  Numerus #{puzzle.puzzle_number}
                  {isCompleted && <span className="ml-2 text-green-600">✓</span>}
                </p>
                <p className="text-gray-700">{puzzle.number}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(puzzle.date), "MMMM d, yyyy")}
                </p>
              </button>
            );
          })}
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Thanks for playing!</h2>
            <p className="text-sm text-gray-700 mb-4">
              Some of you may have experienced a glitch recently in the game. Apologies! We've been working hard behind the scenes on an update and something broke in the game's logic. We really appreciate your support and patience!
            </p>
            <p className="text-green-600 font-semibold">
              {rewarded ? "🎁 A bonus archive token has been added!" : "Loading bonus..."}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Got it
            </button>
          </DialogContent>
        </Dialog>
      </div>

     {/* ✅ Stats Modal with stats passed in */}
    {stats && (
  <StatsModal
    open={showStatsModal}
    onClose={() => setShowStatsModal(false)}
    stats={stats}
  />
)}
    </>
  );
}
