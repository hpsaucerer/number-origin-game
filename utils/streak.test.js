const { updateStats } = require("./game");

describe("Streak Tracking", () => {
  const baseStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, failed: 0 },
  };

  it("increments streak and updates maxStreak on win", () => {
    const result = updateStats(baseStats, true, 2);
    expect(result.currentStreak).toBe(1);
    expect(result.maxStreak).toBe(1);
    expect(result.gamesWon).toBe(1);
    expect(result.guessDistribution[2]).toBe(1);
  });

  it("resets streak on loss and updates 'failed'", () => {
    const result = updateStats({ ...baseStats, currentStreak: 3, maxStreak: 3 }, false);
    expect(result.currentStreak).toBe(0);
    expect(result.maxStreak).toBe(3);
    expect(result.guessDistribution.failed).toBe(1);
  });

  it("increases maxStreak if current streak exceeds it", () => {
    const result = updateStats({ ...baseStats, currentStreak: 4, maxStreak: 4 }, true, 1);
    expect(result.currentStreak).toBe(5);
    expect(result.maxStreak).toBe(5);
  });
});
