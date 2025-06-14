import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { getOrCreateDeviceId } from "@/lib/device";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/ui/header";
import { useModal } from "@/context/ModalContext";
import StatsModal from "@/components/modals/StatsModal";
import InstructionsModal from "@/components/modals/InstructionsModal";
import CategoryPills from "@/components/CategoryPills";
import useStats from "@/hooks/useStats";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Archive() {
  const [available, setAvailable] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  const [showStats, setShowStats] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { setShowAchievements } = useModal();
  const { stats, data, COLORS, renderCenterLabel, combinedLabel } = useStats();

  const handleBuyTokens = async () => {
    const stripe = await stripePromise;
    document.cookie = `device_id=${getOrCreateDeviceId().toLowerCase()}; path=/; max-age=31536000`;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await response.json();
    const result = await stripe.redirectToCheckout({ sessionId: data.id });

    if (result.error) {
      console.error("❌ Stripe redirect error:", result.error.message);
      alert("There was a problem redirecting to checkout.");
    }
  };

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
          body: JSON.stringify({ device_id: deviceId, source: "archive_completion_reward" }),
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
        body: JSON.stringify({ device_id: deviceId, source: "archive_visit_bonus" }),
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

      if (!tokenError) {
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
        onStatsClick={() => setShowStats(true)}
        onAchievementsClick={() => setShowAchievements(true)}
        onHelpClick={() => setShowInstructions(true)}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">The Archives</h1>

        {tokenCount > 0 && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded mb-4 text-center">
            🪙 You have {tokenCount} unused token{tokenCount > 1 ? "s" : ""} to play an archive puzzle!
          </div>
        )}

        <p className="text-gray-600 text-center mb-6">
          Here you can delve into previous puzzles by using tokens, which you can earn by completing category achievements or buy using the button below.
        </p>

        <div className="text-center mb-6">
          <button
            onClick={handleBuyTokens}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Buy 5 Archive Tokens ($1.00)
          </button>

          <img
            src="/icons/powered-by-stripe.svg"
            alt="Powered by Stripe"
            className="mt-2 h-8 mx-auto"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {available.map((puzzle) => {
            const completedIds = JSON.parse(localStorage.getItem("completedPuzzles") || "[]");
            const isCompleted = completedIds.includes(puzzle.id);

            return (
              <button
                key={puzzle.id}
                onClick={async () => {
                  if (!puzzle?.puzzle_number) return;
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
                    localStorage.setItem("archiveTokenUsed", "true");
                    router.push(`/archive/${puzzle.puzzle_number}`);
                  } else {
                    alert("🪙 You're out of tokens — but don't worry, you can earn or buy more.");
                  }
                }}
                disabled={isCompleted}
                className={`border rounded-lg p-4 text-left transition relative ${
                  isCompleted ? "bg-gray-200 opacity-60 cursor-default" : "bg-white hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-1 text-xl font-bold">
                <span>#{puzzle.puzzle_number}</span>
                 {isCompleted && <span className="text-green-600 text-lg">✓</span>}
                </div>
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
              Some of you may have experienced a glitch yesterday in the game. Apologies! We've been working hard behind the scenes on an update and something broke in the game's logic. We really appreciate your support and patience!
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

      {/* Modals */}
      {showStats && (
        <StatsModal
          open={showStats}
          onClose={() => setShowStats(false)}
          stats={stats}
          data={data}
          COLORS={COLORS}
          combinedLabel={combinedLabel}
          renderCenterLabel={renderCenterLabel}
        />
      )}
      {showInstructions && (
        <InstructionsModal
          open={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </>
  );
}
