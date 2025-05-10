export default async function handler(req, res) {
  console.log("🛬 Incoming request to LLM judge");

  const { guess, puzzle, labelMatch } = req.body;

  // ✅ Defensive check for required puzzle structure
  if (!puzzle || !puzzle.answer || !puzzle.number || !puzzle.essential_keywords) {
    console.error("❌ Invalid puzzle data received:", puzzle);
    return res.status(400).json({ accept: false, raw: "invalid puzzle" });
  }

  // Confirm puzzle is complete
  console.log("🧩 Received puzzle data:", puzzle);

  const normalizeQuotes = (text) =>
    text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

  const cleanedGuess = normalizeQuotes(guess).trim().toLowerCase();
  const cleanedAnswer = normalizeQuotes(puzzle.answer).trim().toLowerCase();

  // ✅ Emergency override if label match is solid
  if (
    cleanedGuess === cleanedAnswer ||
    labelMatch?.matchedAnswer === cleanedAnswer ||
    labelMatch?.essentialHit?.includes(cleanedAnswer)
  ) {
    console.log("✅ Accepted by label match fallback.");
    return res.status(200).json({ accept: true, reason: "label override" });
  }

  // 🔒 Block any guess that includes known conflicts
  if (labelMatch?.conflictDetected?.length > 0) {
    console.log("🚫 Rejected due to conflict terms:", labelMatch.conflictDetected);
    return res.status(200).json({ accept: false, reason: "conflict rejection" });
  }

  const prompt = `
You are evaluating a user guess in a trivia game.

Puzzle: What is the significance of the number ${puzzle.number ?? "(unknown)"}?

Target Answer: ${puzzle.answer}
Essential Keywords: ${puzzle.essential_keywords.join(", ")}
Required Keywords: ${(puzzle.keywords || []).join(", ")}

User Guess: ${guess}

Question: Does the user guess clearly refer to the same concept as the target answer?

Respond with only "Yes" or "No".
  `.trim();

  console.log("🧠 LLM Prompt:\n", prompt);

  try {
    const initialResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "meta/meta-llama-3-8b-instruct",
        input: {
          prompt,
          system_prompt:
            "Respond strictly with Yes or No. Only say Yes if the guess refers specifically to the same real-world concept as the target answer. Do not accept related or similar guesses that refer to a different concept.",
          temperature: 0.2,
          max_new_tokens: 30,
        },
      }),
    });

    const prediction = await initialResponse.json();
    const pollUrl = prediction?.urls?.get;

    if (!pollUrl) {
      throw new Error("Missing polling URL from Replicate response.");
    }

    console.log("📡 Polling Replicate until prediction completes...");

    let finalOutput = null;
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1000));
      const pollResponse = await fetch(pollUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const pollData = await pollResponse.json();
      console.log(`🔄 Poll attempt ${attempts + 1} → Status: ${pollData.status}`);

      if (pollData.status === "succeeded") {
        console.log("📦 Full Replicate pollData:", JSON.stringify(pollData, null, 2));

        const rawOutput = Array.isArray(pollData.output)
          ? pollData.output.join(" ")
          : pollData.output ?? "";

        finalOutput = typeof rawOutput === "string" ? rawOutput.toLowerCase() : "";
        break;
      }

      if (pollData.status === "failed") {
        throw new Error("Prediction failed");
      }

      attempts++;
    }

    if (!finalOutput || !finalOutput.trim()) {
      console.warn("⚠️ LLM output not ready or empty after max attempts.");
      return res.status(500).json({ accept: false, raw: "timeout" });
    }

    console.log("🧠 LLM Raw Output:", finalOutput);

    const accept = finalOutput.includes("yes");

    if (accept) {
      console.log("✅ LLM accepted guess");
    } else {
      console.warn("🚫 LLM rejected guess");
    }

    res.status(200).json({ accept, raw: finalOutput, reason: "llm" });
  } catch (error) {
    console.error("❌ LLM API Error:", error);
    res.status(500).json({ accept: false, raw: "error" });
  }
}
