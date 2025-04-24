export async function fetchTodayPuzzle() {
  try {
    const res = await fetch("/api/today");
    if (!res.ok) throw new Error("Failed to fetch today's puzzle");
    const data = await res.json();

    return {
      ...data,
      revealFormattedAt: data.reveal_formatted_at,
    };
  } catch (err) {
    console.error("❌ fetchTodayPuzzle error:", err.message);
    return null;
  }
}

export async function fetchAllPuzzles() {
  try {
    const res = await fetch("/api/all");
    if (!res.ok) throw new Error("Failed to fetch puzzles");
    const data = await res.json();

    return data.map((p) => ({
      ...p,
      revealFormattedAt: p.reveal_formatted_at,
    }));
  } catch (err) {
    console.error("❌ fetchAllPuzzles error:", err.message);
    return [];
  }
}
