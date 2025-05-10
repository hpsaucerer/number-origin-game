"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MetadataGenerator() {
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
  setLoading(true);
  setResult("");

const prompt = `
I'm building a game called "Number Origin" where players guess what a number represents. For the given number, I need you to help populate four important fields in my database:

1. acceptable_guesses — a list of full phrases or answers that should be accepted as correct (including short and long forms).
2. essential_keywords — a set of words that are core to the answer, and must appear in a guess (or via synonym mapping).
3. keywords — additional helpful context words that are not essential but improve the confidence of a match.
4. conflicts — words or phrases that are *closely related but incorrect*, and should cause the guess to be rejected. These include common confusions, rival concepts, similar facts, or answers about the wrong gender, sport, location, or chemical element.

Also, suggest any new synonyms I should add to a synonymMap to handle alternative phrasing or common misspellings. Return the results in clearly labeled sections, in JSON-friendly format for each field.

Let’s do this for the number: **${number}**
Its significance is: **${description}**

Provide thoughtful, varied guesses and realistic player expressions. Make sure the keywords are intelligently chosen to support fuzzy matching, and conflicts protect against easy mistakes.
`.trim();


  try {
    const res = await fetch("/api/generate-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // fallback in case JSON fails
      console.error("❌ Server responded with error:", res.status, errorText);
      setResult(`⚠️ Server error ${res.status}:\n${errorText}`);
      return;
    }

    const data = await res.json();
    setResult(data.output || "⚠️ No output received.");
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    setResult("⚠️ Something went wrong. Check the console for details.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 space-y-4 bg-white border shadow rounded">
      <h2 className="text-xl font-semibold">🧠 Puzzle Metadata Generator</h2>
      <Input
        placeholder="Enter number (e.g. 1.618)"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <Input
        placeholder="Enter description (e.g. The golden ratio)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Metadata"}
      </Button>
      <textarea
  rows={16}
  value={result}
  readOnly
  className="w-full p-3 border border-gray-300 rounded font-mono bg-gray-50 text-sm"
  style={{ whiteSpace: "pre-wrap" }}
/>

    </div>
  );
}
