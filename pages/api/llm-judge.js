export default async function handler(req, res) {
  console.log("🛬 Incoming request to LLM judge");

  const { guess, puzzle } = req.body;

  const normalizeQuotes = (text) =>
    text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

  const cleanedGuess = normalizeQuotes(guess);
  const cleanedAnswer = normalizeQuotes(puzzle.answer);

  const prompt = `
You are evaluating a user guess in a trivia game.

Puzzle: What is the significance of the number ${puzzle.number ?? "(unknown)"}?

Target Answer: ${cleanedAnswer}
Essential Keywords: ${puzzle.essential_keywords.join(", ")}
Required Keywords: ${(puzzle.keywords || []).join(", ")}

User Guess: ${cleanedGuess}

Question: Does the user guess clearly refer to the same concept as the target answer?

Respond with only "Yes" or "No".
  `.trim();

  console.log("🧠 LLM Prompt:\n", prompt);

  try {
    // Step 1: Initiate prediction
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
            "Respond strictly with Yes or No. Accept if the guess refers to the same real-world concept, even if phrased differently or spelled in British English.",
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

    // Step 2: Poll until prediction completes (up to 60 seconds)
    let finalOutput = null;
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1000)); // 1 second
      const pollResponse = await fetch(pollUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const pollData = await pollResponse.json();
      console.log(`🔄 Poll attempt ${attempts + 1} → Status: ${pollData.status}`);

      if (pollData.status === "succeeded") {
        finalOutput = pollData.output?.toLowerCase?.() ?? "";
        break;
      }

      if (pollData.status === "failed") {
        throw new Error("Prediction failed");
      }

      attempts++;
    }

    if (!finalOutput) {
      console.warn("⚠️ LLM output not ready after max attempts (timeout).");
      return res.status(500).json({ accept: false, raw: "timeout" });
    }

    console.log("🧠 LLM Raw Output:", finalOutput);

    const accept = finalOutput.includes("yes");

    if (accept) {
      console.log("✅ LLM accepted guess");
    } else {
      console.warn("🚫 LLM rejected guess");
    }

    res.status(200).json({ accept, raw: finalOutput });
  } catch (error) {
    console.error("❌ LLM API Error:", error);
    res.status(500).json({ accept: false, raw: "error" });
  }
}
