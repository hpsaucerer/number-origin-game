import { useRef, useState } from "react";

export default function CategoryPills() {
  const categories = [
    {
      label: "Maths",
      color: "bg-blue-200 text-blue-800",
      tooltip: "Equations, constants, mathematical discoveries, calculations.",
    },
    {
      label: "Geography",
      color: "bg-green-200 text-green-800",
      tooltip: "Distances, coordinates, elevations, statistics.",
    },
    {
      label: "Science",
      color: "bg-orange-200 text-orange-800",
      tooltip: "Atomic numbers, scientific constants, measurements. ",
    },
    {
      label: "History",
      color: "bg-yellow-200 text-yellow-800",
      tooltip: "Monumental events, inventions, revolutions, treaties.",
    },
    {
      label: "Culture",
      color: "bg-purple-200 text-purple-800",
      tooltip: "Movies, literature, music, art.",
    },
    {
      label: "Sport",
      color: "bg-red-200 text-red-800",
      tooltip: "World records, famous jersey numbers, stats, memorable dates.",
    },
  ];

  const tooltipRefs = useRef([]);
  const [openTooltip, setOpenTooltip] = useState(null);

  const toggleTooltip = (idx) => {
    setOpenTooltip(openTooltip === idx ? null : idx);
  };

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {categories.map((cat, idx) => (
        <div
          key={idx}
          className="relative"
          ref={(el) => (tooltipRefs.current[idx] = el)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTooltip(idx);
            }}
            className={`category-pill inline-flex items-center justify-center px-2.5 py-1 rounded-full font-semibold text-sm ${cat.color}`}
          >
            <img
              src={`/icons/${cat.label.toLowerCase()}.png`}
              alt={`${cat.label} icon`}
              className="w-8 h-8 mr-0"
              style={{ marginTop: "-1px" }}
            />
            {cat.label}
          </button>

          {openTooltip === idx && (
            <div className="tooltip absolute bottom-full left-0 mb-2 bg-white shadow-lg p-2 rounded-md z-50 text-sm leading-snug max-w-[220px]">
              {cat.tooltip}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
