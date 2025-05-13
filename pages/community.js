import SuggestPuzzleForm from "@/components/SuggestPuzzleForm";
import Header from "@/components/ui/header"; // adjust if your path differs

export default function CommunityPage() {
  return (
    <>
      <Header />
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Suggest a Puzzle</h1>
        <p className="mb-6">
          Submit a number you think deserves a future puzzle. If we use it, we’ll credit you!
        </p>
        <SuggestPuzzleForm />
      </div>
    </>
  );
}
