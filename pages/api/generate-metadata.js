import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is missing.");
    return res.status(500).json({ error: "OpenAI key not set" });
  }

  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for game content generation." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const output = completion.choices[0].message.content;
    res.status(200).json({ output });
  } catch (err) {
    console.error("🔴 OpenAI API error:", err); // <- This helps trace exact cause
    res.status(500).json({ error: "API call failed" });
  }
}
