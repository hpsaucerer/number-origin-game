import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { getDeviceIdFromCookie } from "@/lib/device"; // or inline this logic

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "Missing Stripe session ID" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ error: "Invalid or unpaid session" });
    }

    const deviceId = getDeviceIdFromCookie(req.headers.cookie);
    if (!deviceId) {
      return res.status(400).json({ error: "Missing device ID in cookie" });
    }

    const normalizedId = deviceId.toLowerCase();
    const token_date = new Date().toISOString().split("T")[0];

    // Insert 5 new tokens
    const tokenRows = Array.from({ length: 5 }).map(() => ({
      device_id: normalizedId,
      used: false,
      used_at: null,
      puzzle_number: null,
      token_date,
      source: "stripe_checkout"
    }));

    const { error } = await supabase.from("ArchiveTokens").insert(tokenRows);

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ confirm-purchase error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
