export async function fetchTodayPuzzle() {
  try {
    const res = await fetch("/api/today");
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

export async function fetchAllPuzzles() {
  try {
    const res = await fetch("/api/all");
    if (!res.ok) throw new Error(`Failed to fetch all puzzles: ${res.status}`);
    const puzzles = await res.json();

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Fetched all puzzles successfully.");
    }

    return puzzles;
  } catch (error) {
    console.error(`❌ API Error (fetchAllPuzzles): ${error.message}`);
    return [];
  }
}
