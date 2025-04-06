  export function shareResult({ isCorrect, currentStreak }) {
  const shareText = isCorrect
    ? `I cracked today’s Number Origin puzzle in ${currentStreak} ${
        currentStreak === 1 ? "guess" : "guesses"
      }! 🧠 #NumberOrigin`
    : `Today’s Number Origin puzzle stumped me! 😅 #NumberOrigin`;

  if (navigator.share) {
    navigator
      .share({
        title: "Number Origin – Play now!",
        text: shareText,
        url: "https://numerus.site",
      })
      .catch((err) => console.error("Sharing failed:", err));
  } else {
    navigator.clipboard.writeText(`${shareText} https://numerus.site`);
    alert("Result copied to clipboard! 📋");
  }
}

