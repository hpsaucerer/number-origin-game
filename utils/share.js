export function shareResult({ isCorrect, attempts }) {
  const guessCount = isCorrect ? attempts + 1 : "X";

  const shareText = isCorrect
    ? `I cracked today’s Numerus puzzle in ${guessCount} ${guessCount === 1 ? "guess" : "guesses"}! 🧠 #NumerusPuzzle`
    : `Today’s Numerus puzzle stumped me! 😅 #NumerusPuzzle`;

  const fullText = `${shareText}\nhttps://numerus.site`;

  if (navigator.share) {
    navigator
      .share({
        title: "Numerus – Play now!",
        text: fullText,
        url: "https://numerus.site",
      })
      .catch((err) => console.error("Sharing failed:", err));
  } else {
    navigator.clipboard.writeText(fullText);
    alert("Result copied to clipboard! 📋");
  }
}

