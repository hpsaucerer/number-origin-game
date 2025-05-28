export async function fetchTodayPuzzle() {
  try {
    const baseUrl =
      process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_INTERNAL_API_URL || "";

    const res = await fetch(`${baseUrl}/api/today`);
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
