"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { HistoricalDataPoint } from "@/lib/data/charts-data";

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EMPTY_SKELETON = ALL_MONTHS.map((name) => ({
  name,
  Qualified: 0,
  BDRetained: 0,
  Pending: 0,
}));

interface Props {
  data: HistoricalDataPoint[];
}

// ... imports unchanged

const CustomBarChart = ({ data }: Props) => {
  const chartData = EMPTY_SKELETON.map((skeleton) => {
    const real = data.find((d) => d.name === skeleton.name);
    return real ?? skeleton;
  });

  return (
    <div className="w-full h-[65vh]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          barGap={8}
        >
          {/* Subtle grid lines help monitoring accuracy */}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis 
            width={40} 
            allowDecimals={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            axisLine={false}
            tickLine={false}
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

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
              paddingBottom: "20px",
              color: "#475569",
            }}
          />

         
          <Bar
            dataKey="BDRetained"
            name="BD Retained"
            fill="#4988C4" // Sky 500
            radius={[4, 4, 0, 0]}
          />
           <Bar
            dataKey="Pending"
            fill="#1C4D8D" // Amber 500
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Qualified"
            fill="#0F2854" // Indigo 500
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
