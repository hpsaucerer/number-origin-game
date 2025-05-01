// app/how-to-play/page.js
import Link from "next/link";
import Header from "@/components/ui/header"; // Adjust if your file is named differently

export default function HowToPlayPage({ renderCategoryPills }) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center pt-24 px-4 pb-8 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">How To Play</h1>

          <div className="mt-2 font-vietnam">
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <img src="/icons/one.png" alt="Look Icon" className="w-8 h-8 mt-1" />
                <div>
                  <strong>Look at the number.</strong><br />
                  What could it signify?
                </div>
              </li>
              <li className="flex items-start gap-4">
                <img src="/icons/two.png" alt="Type Icon" className="w-8 h-8 mt-1" />
                <div>
                  <strong>Make a guess. You have 4 in total.</strong><br />
                  Type what you think the number relates to; e.g. 'keys on a piano', 'moon landing'.
                </div>
              </li>
              <li className="flex items-start gap-4">
                <img src="/icons/three.png" alt="Clue Icon" className="w-8 h-8 mt-1" />
                <div>
                  <strong>Stuck? Reveal a clue!</strong><br />
                  Remember though, this uses up a guess.
                </div>
              </li>
            </ul>

            <div className="flex justify-center mt-8">
              <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 w-full text-center shadow-md">
                <h2 className="text-lg font-bold mb-2 text-gray-800">Categories</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Tap the buttons below to explore the categories in more detail.
                </p>
                {renderCategoryPills && renderCategoryPills()}
              </div>
            </div>
          </div>

          {/* 🔙 Optional back to Home button */}
          <div className="mt-8 text-center">
            <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
