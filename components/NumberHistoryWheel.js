export default function NumberHistoryWheel({ history }) {
  const [selected, setSelected] = useState(null);

  // nicely format a numeric selection
  const formattedNumber =
    selected && !isNaN(Number(selected))
      ? Number(selected).toLocaleString()
      : selected;

  // find the full puzzle record
  const puzzle = history.find((p) => p.number === selected);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex w-full max-w-4xl flex-col md:flex-row items-start gap-4">
        {/* ─── the scrollable list ─── */}
        <div className="h-32 md:h-48 w-full md:w-1/2 overflow-y-auto border rounded bg-white shadow-inner">
          <ul className="divide-y">
            {history
              .map((p) => p.number)
              .sort((a, b) => parseFloat(b) - parseFloat(a))
              .map((num) => (
                <li
                  key={num}
                  onClick={() => setSelected(num)}
                  className={`p-3 cursor-pointer hover:bg-yellow-100
                    ${selected === num ? "bg-yellow-200 font-bold" : ""}`}
                >
                  {num}
                </li>
              ))}
          </ul>
        </div>

        {/* ─── the “answer” card ─── */}
        {puzzle && (
          <div className="relative w-full md:w-1/2 p-4 rounded-lg bg-blue-50 shadow-md overflow-visible">
            <img
              src="/logo.svg"
              alt=""
              className="pointer-events-none absolute -top-1 -right-1 w-24 opacity-10"
            />
            <p className="text-lg font-medium text-gray-900">
              {formattedNumber}
            </p>
            <p className="text-sm mt-1 text-gray-700">{puzzle.answer}</p>
          </div>
        )}
      </div>

      {/* ─── the “fun fact” card underneath ─── */}
      {puzzle && (
        <div className="relative w-full max-w-4xl p-4 mt-2 rounded-lg bg-white shadow-md overflow-visible">
          <p className="text-sm text-gray-600">{puzzle.fun_fact}</p>
        </div>
      )}
    </div>
  );
}
