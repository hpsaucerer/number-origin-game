export function shareResult({ isCorrect, attempts, puzzle }) {
  const guessCount = isCorrect ? attempts + 1 : "X";
  const puzzleId = puzzle?.id ?? "?";

export function shareResult({ isCorrect, guessCount, puzzleNumber }) {
  const shareText = isCorrect
    ? `I cracked Numerus #${puzzleNumber} in ${guessCount} ${guessCount === 1 ? "guess" : "guesses"}! 🧠`
    : `Numerus #${puzzleNumber} stumped me today! 😅`;

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


