// components/dashboard/customer-pie-chart.tsx
"use client";

import { Pie, PieChart, PieLabelRenderProps, Sector } from "recharts";

const COLORS = ["#dbeafe", "#fef9c2"];
const STROKES = ["oklch(70.7% 0.165 254.624)", "oklch(85.2% 0.199 91.936)"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null)
    return null;
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + radius * Math.cos(-(Number(midAngle) ?? 0) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-(Number(midAngle) ?? 0) * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#1a3a5c"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
};

interface Props {
  bdRetainedCount: number;
  pendingCount: number;
}

export default function CustomerPieChart({
  bdRetainedCount,
  pendingCount,
}: Props) {
  const data = [
    { name: "BD Retained", value: bdRetainedCount },
    { name: "Pending", value: pendingCount },
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        dataKey="value"
        shape={(props: any) => (
          <Sector
            {...props}
            fill={COLORS[props.index % COLORS.length]}
            stroke={STROKES[props.index % STROKES.length]}
            strokeWidth={1}
          />
        )}
      />
    </PieChart>
  );
}
