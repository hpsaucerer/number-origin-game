function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();
}

function isCorrectGuess(guess, answer, acceptableGuesses = []) {
  const normalizedGuess = normalize(guess);
  const allAcceptables = [answer, ...acceptableGuesses].map(normalize);
  return allAcceptables.includes(normalizedGuess);
}

function isCloseGuess(guess, keywords = []) {
  const normalizedGuess = normalize(guess);
  return keywords.some((kw) => normalizedGuess.includes(normalize(kw)));
}

function revealNextClue(puzzle, revealedClues, attempts, maxAttempts = 4) {
  if (
    attempts >= maxAttempts ||
    revealedClues.length >= puzzle.clues.length
  ) {
    return revealedClues;
  }

  return [...revealedClues, puzzle.clues[revealedClues.length]];
}

function updateStats(stats, didWin, attempts) {
  const updated = { ...stats };

  updated.gamesPlayed += 1;

  if (didWin) {
    updated.gamesWon += 1;
    updated.currentStreak += 1;
    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    updated.guessDistribution[attempts] = (updated.guessDistribution[attempts] || 0) + 1;
  } else {
    updated.currentStreak = 0;
    updated.guessDistribution.failed = (updated.guessDistribution.failed || 0) + 1;
  }

  return updated;
}

function isValidGuess(guess) {
  return guess.trim().length > 0;
}

module.exports = {
  isCorrectGuess,
  isCloseGuess,
  revealNextClue,
  updateStats,
  isValidGuess,
};
