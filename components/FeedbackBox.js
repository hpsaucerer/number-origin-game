// components/FeedbackBox.jsx
import React from "react";

const FeedbackBox = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-4 shadow-sm mt-4">
      <p className="text-sm text-blue-900 font-medium mb-2">
        💬 Love Numerus? Loathe it? Let us know what you think!
      </p>
      <a
        href="https://forms.gle/LifsBp42q2KBJRRK7"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Fill out the Feedback Form
      </a>
    </div>
  );
};

export default FeedbackBox;
