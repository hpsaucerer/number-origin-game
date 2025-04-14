const MAX_ATTEMPTS = 4;

function revealNextClue(puzzle, revealedClues, attempts) {
  if (
    attempts >= MAX_ATTEMPTS ||
    revealedClues.length >= puzzle.clues.length
  ) {
    return revealedClues;
  }

  return [...revealedClues, puzzle.clues[revealedClues.length]];
}

describe("Clue Reveal Logic", () => {
  const puzzle = {
    clues: ["Clue 1", "Clue 2", "Clue 3", "Clue 4"],
  };

  it("reveals the first clue after first wrong attempt", () => {
    const revealed = revealNextClue(puzzle, [], 1);
    expect(revealed).toEqual(["Clue 1"]);
  });

  it("reveals the second clue on next attempt", () => {
    const revealed = revealNextClue(puzzle, ["Clue 1"], 2);
    expect(revealed).toEqual(["Clue 1", "Clue 2"]);
  });

  it("stops revealing clues after 4 attempts", () => {
    const revealed = revealNextClue(puzzle, ["Clue 1", "Clue 2", "Clue 3", "Clue 4"], 4);
    expect(revealed).toEqual(["Clue 1", "Clue 2", "Clue 3", "Clue 4"]);
  });

  it("does not reveal clues if all clues are already shown", () => {
    const revealed = revealNextClue(puzzle, ["Clue 1", "Clue 2", "Clue 3", "Clue 4"], 3);
    expect(revealed).toEqual(["Clue 1", "Clue 2", "Clue 3", "Clue 4"]);
  });
});
