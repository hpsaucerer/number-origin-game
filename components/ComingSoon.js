import React from "react";

const ComingSoon = ({ nextDate = "tomorrow" }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-12 text-center px-4">
      <h1 className="text-2xl font-bold text-gray-800">⏳ No puzzle today</h1>
      <p className="text-md text-gray-600 mt-3">
        Our next puzzle drops <span className="font-semibold">{nextDate}</span>!
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Check back daily to test your number knowledge.
      </p>
    </div>
  );
};

export default ComingSoon;
