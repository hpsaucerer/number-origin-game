export function shareResult({ isCorrect, attempts, puzzle }) {
  const guessCount = isCorrect ? attempts + 1 : "X";
  const puzzleId = puzzle?.id ?? "?";

  const shareText = isCorrect
    ? `I cracked Numerus #${puzzleId} in ${guessCount} ${guessCount === 1 ? "guess" : "guesses"}! 🧠`
    : `Numerus #${puzzleId} stumped me today! 😅`;

  const fullMessage = `${shareText}\nPlay it here: https://numerus.site`;


  if (navigator.share) {
    navigator
      .share({
        title: "Numerus – Play now!",
        text: fullMessage,
      
      })
      .catch((err) => console.error("Sharing failed:", err));
  } else {
    navigator.clipboard.writeText(fullMessage);
    alert("Result copied to clipboard! 📋");
  }
}


