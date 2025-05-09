// lib/llm.js
export async function askLLMFallback({ guess, puzzle }) {
  const res = await fetch("/api/llm-judge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guess, puzzle }),
  });

  const { accept, raw } = await res.json();
  return { accept, raw };
}
