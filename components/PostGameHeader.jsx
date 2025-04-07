import React from "react";

const imageMap = {
  1: "/gotitinone.png",
  2: "/second.png",
  3: "/thirdtime.png",
  4: "/squeaky.png",
  failed: "/tomorrow.png",
};

const titleMap = {
  1: "Perfect!",
  2: "Nice one!",
  3: "Close call!",
  4: "That was tight!",
  failed: "Better luck tomorrow!",
};

export default function PostGameHeader({ attempts, isCorrect }) {
  const key = isCorrect ? attempts + 1 : "failed";
  const image = imageMap[key];
  const title = titleMap[key];
  const countText = isCorrect ? `${attempts + 1} of 4 guesses` : `All 4 guesses used`;

  return (
<div className="flex flex-col items-center space-y-1 m-0 p-0">
  <img
  src={image}
  alt={title}
  className="w-32 h-32 mb-1 block object-contain"
  style={{ display: "block", boxSizing: "border-box" }}
/>

  <div className="text-base font-medium text-gray-800">{countText}</div>
</div>
  );
}
