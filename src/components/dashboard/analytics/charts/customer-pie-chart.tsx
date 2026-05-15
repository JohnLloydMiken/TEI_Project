// components/dashboard/customer-pie-chart.tsx
"use client";

import { Bold } from "lucide-react";
import { Pie, PieChart, PieLabelRenderProps, Sector, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#778088 ", "#093C5D"]; // [BD Retained (Sky), Pending (Amber)]




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
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontWeight={10}  
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

export default function CustomerPieChart({ bdRetainedCount, pendingCount }: Props) {
  const data = [
    { name: "BD Retained", value: bdRetainedCount },
    { name: "Pending", value: pendingCount },
  ];

  return (
    <div className="w-full h-64 flex justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart >
          <Pie
          
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Added slight inner radius for a modern "Donut-ish" look
            outerRadius={100}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
            shape={(props: any) => (
              <Sector
                {...props}
                fill={COLORS[props.index % COLORS.length]}
          

              />
            )}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#1a3a5c", fontWeight: 700, marginBottom: '4px' }}
          />
    
        </PieChart>
          
      </ResponsiveContainer>
    </div>
  );
}
