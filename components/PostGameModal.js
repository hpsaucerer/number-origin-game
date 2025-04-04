import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FunFactBox from "./FunFactBox";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function PostGameModal({ open, onClose, isCorrect, stats, puzzle }) {
  const data = Object.entries(stats.guessDistribution).map(([label, value]) => ({
    name: label,
    value,
  }));

  const COLORS = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"]; // Green to red

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isCorrect ? "🎉 Correct!" : "📌 Nice Try!"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FunFactBox puzzle={puzzle} />
          
          <div className="text-center">
            <p className="text-sm font-semibold">Streak Stats</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={60}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm font-medium">Next puzzle in:</p>
            <p className="text-xl font-mono">{countdown}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
