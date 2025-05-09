export default async function handler(req, res) {
  const { guess, puzzle } = req.body;

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

  console.log("🧠 LLM Prompt:\n", prompt); // 🧩 Add this

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "meta/meta-llama-3-8b-instruct",
        input: {
          prompt,
          system_prompt: "Respond strictly with Yes or No.",
          temperature: 0.2,
          max_new_tokens: 30,
        },
      }),
    });

    const result = await response.json();
    const output = result?.output?.toLowerCase() ?? "";

    console.log("🧠 LLM Raw Output:", output); // 🧩 Add this

    const accept = output.includes("yes");
    res.status(200).json({ accept, raw: output });
  } catch (error) {
    console.error("❌ LLM API Error:", error);
    res.status(500).json({ accept: false, raw: "error" });
  }
}
