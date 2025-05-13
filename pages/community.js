import SuggestPuzzleForm from "@/components/SuggestPuzzleForm";

export default function CommunityPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Community Puzzle Suggestions</h1>
      <p className="mb-6">
        Submit a number you’d love to see in a future puzzle. If we use it, we'll feature your name!
      </p>
      <SuggestPuzzleForm />
    </div>
  );
}
