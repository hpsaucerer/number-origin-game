import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!session_id) return;

    const confirmPurchase = async () => {
      try {
        const res = await fetch("/api/confirm-purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id }),
        });

        const data = await res.json();
        setConfirmed(data.success);
      } catch (err) {
        console.error("❌ Purchase confirmation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    confirmPurchase();
  }, [session_id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Verifying your purchase...</p>;
  }

  return (
    <div className="max-w-xl mx-auto text-center px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">🎉 Thank you for your purchase!</h1>
      {confirmed ? (
        <p className="text-green-600 text-lg">
          5 archive tokens have been added to your account.
        </p>
      ) : (
        <p className="text-red-600 text-lg">
          We couldn’t confirm the purchase. Please contact support if tokens weren’t delivered.
        </p>
      )}
      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/archives")}
      >
        Back to Archives
      </button>
    </div>
  );
}
