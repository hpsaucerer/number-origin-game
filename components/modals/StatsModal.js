export default function StatsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2">Your Stats</h3>
        <p className="text-gray-700 mb-4">
          Stats functionality will go here.
        </p>
        <button onClick={onClose} className="text-blue-600 underline">
          Close
        </button>
      </div>
    </div>
  );
}
