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

  // Use alternate image name for Oracle title
  const iconFilename = `${title.toLowerCase()}.png`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <DialogContent className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 pt-4 overflow-y-auto max-h-[90vh] flex flex-col items-center justify-center">
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
              <h2 className="text-xl text-gray-800 text-left">Statistics</h2>
            </DialogHeader>
          </div>

          {/* Stat boxes */}
          <div className="grid grid-cols-4 gap-4 text-center my-6">
            <div>
              <p className="text-3xl font-bold">{stats.gamesPlayed}</p>
              <p className="text-sm text-gray-600">Played</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {stats.gamesPlayed > 0
                  ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                  : 0}
              </p>
              <p className="text-sm text-gray-600">Win %</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.currentStreak}</p>
              <p className="text-sm text-gray-600">Current<br />Streak</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.maxStreak}</p>
              <p className="text-sm text-gray-600">Max<br />Streak</p>
            </div>
          </div>

          {/* Chart + Title Side-by-Side */}
          <div className="flex flex-row items-center justify-center gap-6 w-full mt-4">
            {/* Chart + Ring */}
            <div className="flex flex-col items-center">
              <img
                src="/icons/Ring-icon.png"
                alt="Ring o' Results"
                className="w-32 h-32 mx-auto mb-0"
              />
              <div className="overflow-visible">
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      label={combinedLabel}
                      labelLine={false}
                      isAnimationActive={true}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === "1" ? "#FFD700" : COLORS[index % COLORS.length]}
                        />
                      ))}
                      <Label content={renderCenterLabel} position="center" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Title Icon + Avg Guess (no box) */}
            <div className="flex flex-col justify-center items-center space-y-2 text-center">
              <p className="text-base text-gray-600 font-medium">Your Rank:</p>
              <img
                src={`/icons/${iconFilename}`}
                alt={`${title} icon`}
                className="w-20 h-20 object-contain"
              />
              <div>
                <p className="text-3xl font-bold text-gray-800">{avgGuesses}</p>
                <p className="text-sm text-gray-600">Avg guesses per win</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
