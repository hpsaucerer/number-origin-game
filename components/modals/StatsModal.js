import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from "recharts";

export default function StatsModal({ open, onClose, stats, data, COLORS, renderCenterLabel, combinedLabel }) {
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
  <DialogTitle className="text-lg text-gray-800 text-left">
    Statistics
  </DialogTitle>
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

          {/* Chart & Ring icon */}
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/icons/Ring-icon.png"
              alt="Ring o' Results"
              className="w-36 h-36 mx-auto mb-[-64px]"
            />

            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label={combinedLabel}
                  labelLine={false}
                  isAnimationActive={true}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label content={renderCenterLabel} position="center" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
