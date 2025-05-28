// lib/api.js
export async function fetchTodayPuzzle() {
  try {
    const baseURL =
      typeof window === "undefined"
        ? process.env.INTERNAL_API_URL || "http://localhost:3000"
        : "";

    const res = await fetch(`${baseURL}/api/today`);
    if (!res.ok) throw new Error(`Failed to fetch today's puzzle: ${res.status}`);

    const puzzle = await res.json();

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Fetched today's puzzle successfully.");
    }

    return puzzle;
  } catch (error) {
    console.error(`❌ API Error (fetchTodayPuzzle): ${error.message}`);
    return null;
  }
}
