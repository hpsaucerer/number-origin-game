export async function fetchTodayPuzzle() {
  try {
    const res = await fetch("/api/today");

    if (!res.ok) {
      throw new Error(`Failed to fetch today's puzzle: ${res.status}`);
    }

    const puzzle = await res.json();

    // Optional logging
    console.log("✅ Today's puzzle fetched from /api/today:", puzzle);

    return puzzle;
  } catch (error) {
    console.error("❌ Error fetching today's puzzle via API route:", error);
    return null;
  }
}
