export async function fetchTodayPuzzle() {
  try {
    const res = await fetch("/api/today");
    if (!res.ok) throw new Error(`Failed to fetch today's puzzle: ${res.status}`);
    const puzzle = await res.json();
    console.log("✅ Today's puzzle fetched from /api/today:", puzzle);
    return puzzle;
  } catch (error) {
    console.error("❌ Error fetching today's puzzle via API route:", error);
    return null;
  }
}

export async function fetchAllPuzzles() {
  try {
    const res = await fetch("/api/all");
    if (!res.ok) throw new Error(`Failed to fetch all puzzles: ${res.status}`);
    const puzzles = await res.json();
    console.log("✅ All puzzles fetched from /api/all:", puzzles);
    return puzzles;
  } catch (error) {
    console.error("❌ Error fetching all puzzles via API route:", error);
    return [];
  }
}

