const { isValidGuess } = require("./game");


describe("Input validation", () => {
  it("rejects empty input", () => {
    expect(isValidGuess("")).toBe(false);
  });

  it("rejects whitespace-only input", () => {
    expect(isValidGuess("   ")).toBe(false);
  });

  it("accepts valid trimmed input", () => {
    expect(isValidGuess("  Newton  ")).toBe(true);
  });
});
