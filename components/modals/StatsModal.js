import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";

function getPlayerTitle(stats) {
  const { gamesWon, guessDistribution } = stats;
  if (gamesWon === 0) return "Dabbler";

  const totalGuesses = Object.entries(guessDistribution)
    .filter(([key]) => key !== "failed")
    .reduce((sum, [key, value]) => sum + parseInt(key) * value, 0);

  const avgGuesses = totalGuesses / gamesWon;

  if (avgGuesses <= 1.5) return "Oracle";
  if (avgGuesses <= 2.2) return "Mage";
  if (avgGuesses <= 3.0) return "Scribe";
  return "Dabbler";
}

export default function StatsModal({ open, onClose, stats, data, COLORS, renderCenterLabel, combinedLabel }) {
  const avgGuesses = (
    Object.entries(stats.guessDistribution)
      .filter(([key]) => key !== "failed")
      .reduce((sum, [key, value]) => sum + parseInt(key) * value, 0) /
    Math.max(stats.gamesWon, 1)
  ).toFixed(2);

  const title = getPlayerTitle(stats);
  const iconFilename = `${title.toLowerCase()}.png`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-2 sm:px-4">
        <DialogContent className="relative bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-xl mx-auto p-4 sm:p-6 pt-3 sm:pt-4 overflow-y-auto max-h-[90vh] flex flex-col items-center justify-center">
          {/* Dismiss Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-1 right-1 p-2 text-blue-500 hover:text-blue-600 transition"
          >
            <X size={28} />
          </button>

          {/* Title */}
          <div className="w-full flex flex-col items-start">
            <DialogHeader className="w-full">
              <h2 className="text-lg sm:text-xl text-gray-800 text-left">Statistics</h2>
            </DialogHeader>
          </div>

          {/* Stat boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center my-4 sm:my-6 w-full">
            <div>
              <p className="text-lg sm:text-3xl font-bold">{stats.gamesPlayed}</p>
              <p className="text-xs sm:text-sm text-gray-600">Played</p>
            </div>
            <div>
              <p className="text-lg sm:text-3xl font-bold">
                {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Win %</p>
            </div>
            <div>
              <p className="text-lg sm:text-3xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs sm:text-sm text-gray-600">Current<br />Streak</p>
            </div>
            <div>
              <p className="text-lg sm:text-3xl font-bold">{stats.maxStreak}</p>
              <p className="text-xs sm:text-sm text-gray-600">Max<br />Streak</p>
            </div>
          </div>

          {/* Chart + Rank Badge */}
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 w-full mt-2 sm:mt-4 flex-wrap">
            {/* Chart Section */}
            <div className="flex flex-col items-center flex-shrink-0">
              <img
                src="/icons/Ring-icon.png"
                alt="Ring o' Results"
                className="w-16 h-16 sm:w-28 sm:h-28 mb-0"
                style={{ marginBottom: "-10px" }}
              />
              <div className="overflow-visible">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      label={combinedLabel}
                      labelLine={false}
                      isAnimationActive={true}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={/1\s*guess/i.test(entry.name) ? "#d4af37" : COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label content={renderCenterLabel} position="center" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rank Badge + Additional Stats */}
            <div className="flex flex-col justify-center items-center space-y-2 text-center flex-shrink-0">
              <p className="text-base sm:text-base text-gray-600 font-medium">Rank:</p>
              <img
                src={`/icons/${iconFilename}`}
                alt={`${title} icon`}
                className="w-20 h-20 sm:w-36 sm:h-36 object-contain"
              />
              <div>
                <p className="text-lg sm:text-3xl font-bold text-gray-800">{avgGuesses}</p>
                <p className="text-xs sm:text-sm text-gray-600">Avg guesses per win</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{stats.guessDistribution[1] || 0}</p>
                <p className="text-xs sm:text-sm text-gray-600">Got it in 1</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
