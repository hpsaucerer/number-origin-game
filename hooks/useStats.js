import { useMemo } from "react";

export default function useStats() {
  const stats = {
    gamesPlayed: 12,
    gamesWon: 8,
    currentStreak: 3,
    maxStreak: 5,
    guessDistribution: {
      1: 2,
      2: 3,
      3: 4,
      4: 3,
      failed: 1,
    },
  };

  const data = [
    { name: "1 Guess", value: stats.guessDistribution[1] },
    { name: "2 Guesses", value: stats.guessDistribution[2] },
    { name: "3 Guesses", value: stats.guessDistribution[3] },
    { name: "4 Guesses", value: stats.guessDistribution[4] },
    { name: "Failed", value: stats.guessDistribution.failed || 0 },
  ];

  const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#2563EB", "#F87171"];

  const renderCenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox;
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#3B82F6"
        fontSize={16}
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        <tspan x={cx} dy="-0.6em">Guess</tspan>
        <tspan x={cx} dy="1.2em">Distribution</tspan>
      </text>
    );
  };

  const combinedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, value,
  }) => {
    if (!value) return null;

    const RADIAN = Math.PI / 180;
    const labelMap = ["1", "2", "3", "4", "✖"];

    const innerRadiusMid = innerRadius + (outerRadius - innerRadius) / 2;
    const xInner = cx + innerRadiusMid * Math.cos(-midAngle * RADIAN);
    const yInner = cy + innerRadiusMid * Math.sin(-midAngle * RADIAN);

    const xOuter = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
    const yOuter = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={xInner}
          y={yInner}
          fill="#FFFFFF"
          fontSize={14}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {labelMap[index] === "❌" ? "✖" : labelMap[index]}
        </text>
        {percent > 0 && (
          <text
            x={xOuter}
            y={yOuter}
            fill="#000000"
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        )}
      </>
    );
  };

  return useMemo(() => ({
    stats,
    data,
    COLORS,
    renderCenterLabel,
    combinedLabel,
  }), []);
}
