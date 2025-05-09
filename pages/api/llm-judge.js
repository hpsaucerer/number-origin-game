export default async function handler(req, res) {
  const { guess, puzzle } = req.body;

  function normalizeLLMInput(str = "") {
    return str
      .toLowerCase()
      .replace(/[’']/g, "") // remove apostrophes
      .replace(/[^a-z0-9\s]/gi, "") // remove punctuation
      .replace(/\s+/g, " ") // normalize whitespace
      .trim();
  }

  const cleanGuess = normalizeLLMInput(guess);
  const cleanAnswer = normalizeLLMInput(puzzle.answer);
  const acceptable = (puzzle.acceptableGuesses || puzzle.acceptable_guesses || []).join(", ");

  const prompt = `
You are evaluating a user guess in a trivia game.

Puzzle: What is the significance of the number ${puzzle.number ?? "(unknown)"}?

Target Answer: ${cleanAnswer}
Essential Keywords: ${puzzle.essential_keywords.join(", ")}
Required Keywords: ${(puzzle.keywords || []).join(", ")}
Acceptable Alternate Guesses: ${acceptable}

User Guess: ${cleanGuess}

Question: Does the user guess clearly refer to the same concept as the target answer?

Respond with only "Yes" or "No".
  `.trim();

  // ✅ Optional debug log in development
  if (process.env.NODE_ENV !== "production") {
    console.log("🧠 LLM Prompt:\n", prompt);
  }

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

  if (process.env.NODE_ENV !== "production") {
    console.log("🧠 LLM Raw Output:\n", output);
  }

  const accept = output.includes("yes");
  res.status(200).json({ accept, raw: output });
}
