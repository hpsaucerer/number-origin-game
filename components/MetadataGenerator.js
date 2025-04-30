"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MetadataGenerator() {
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");

    const prompt = `
I'm building a game called "Number Origin" where players guess what a number represents. For the given number, I need you to help populate three important fields in my database:

1. acceptable_guesses — a list of full phrases or answers that should be accepted as correct (including short and long forms).
2. essential_keywords — a set of words that are core to the answer, and must appear in a guess (or via synonym mapping).
3. keywords — additional helpful context words that are not essential but improve the confidence of a match.

Also, suggest any new synonyms I should add to a synonymMap to handle alternative phrasing or common misspellings. Return the results in clearly labeled sections, in JSON-friendly format for each field.

Let’s do this for the number: **${number}**
Its significance is: **${description}**

Provide thoughtful, varied guesses and realistic player expressions. Make sure the keywords are intelligently chosen to support fuzzy matching.
    `.trim();

    try {
      const res = await fetch("/api/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResult(data.output);
    } catch (err) {
      setResult("⚠️ Something went wrong.");
      console.error(err);
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
      <Textarea rows={16} value={result} readOnly className="font-mono" />
    </div>
  );
}
