function isCorrectGuess(guess, answer, keywords = []) {
  const cleaned = guess.trim().toLowerCase();
  if (cleaned === answer.trim().toLowerCase()) return true;
  return keywords.some((k) => cleaned.includes(k.toLowerCase()));
}

describe("Guess checking logic", () => {
  it("should match exact answer", () => {
    expect(isCorrectGuess("Apollo 11", "Apollo 11")).toBe(true);
  });

  it("should ignore case and whitespace", () => {
    expect(isCorrectGuess("  apollo 11 ", "Apollo 11")).toBe(true);
  });

  it("should match on keyword inclusion", () => {
    expect(isCorrectGuess("moon landing", "Apollo 11", ["moon", "landing"])).toBe(true);
  });

  it("should reject wrong guess", () => {
    expect(isCorrectGuess("Mars Mission", "Apollo 11", ["moon", "landing"])).toBe(false);
  });
});
