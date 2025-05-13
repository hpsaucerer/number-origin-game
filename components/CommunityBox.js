import React from "react";
import Link from "next/link";

const CommunityBox = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 pt-2 pb-4 shadow-sm mt-4 text-center">
      <div className="flex flex-col items-center gap-1 mb-2">
        <img
          src="/icons/numerus-community.png" // adjust if needed
          alt="Community Logo"
          className="w-32 sm:w-26 h-auto object-contain"
        />
        <h2 className="text-lg font-semibold text-gray-800">
          Have a puzzle suggestion?
        </h2>
        <p className="text-gray-600 text-sm">
          Share a number — we might feature it!
        </p>
      </div>
      <Link href="/community">
        <button className="mt-2 px-6 py-2 bg-[#3B82F6] text-white rounded hover:bg-blue-700 transition">
          Submit a Puzzle
        </button>
      </Link>
    </div>
  );
};

export default CommunityBox;
