import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in environment variables.");
  // Optional: if this runs during import, you could even throw to fail early:
  // throw new Error("Missing OPENAI_API_KEY");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for game content generation.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const output = completion.choices[0].message.content;
    res.status(200).json({ output });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "API call failed" });
  }
}
