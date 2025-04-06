  export function shareResult({ isCorrect, currentStreak }) {
  const shareText = isCorrect
    ? `I cracked today’s Numerus puzzle in ${currentStreak} ${
        currentStreak === 1 ? "guess" : "guesses"
      }! 🧠 #NumerusPuzzle`
    : `Today’s Numerus puzzle stumped me! 😅 #NumerusPuzzle`;

  if (navigator.share) {
    navigator
      .share({
        title: "Numerus – Play now!",
        text: shareText,
        url: "https://numerus.site",
      })
      .catch((err) => console.error("Sharing failed:", err));
  } else {
    navigator.clipboard.writeText(`${shareText} https://numerus.site`);
    alert("Result copied to clipboard! 📋");
  }
}

