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

const CustomBarChart = ({ data }: Props) => {
  // Merge real data into the skeleton — months with no batch stay at 0
  const chartData = EMPTY_SKELETON.map((skeleton) => {
    const real = data.find((d) => d.name === skeleton.name);
    return real ?? skeleton;
  });

  return (
    <div className="w-full h-[65vh]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis width={40} allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#1e3a5f", // ← tooltip text color
            }}
            labelStyle={{ color: "#1e3a5f", fontWeight: 600 }} // ← label (month name)
            itemStyle={{ color: "#374151" }} // ← each bar's value row
          />

          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: "#374151", // dark gray — easy to read
              fontWeight: 500,
            }}
          />    

          <Bar
            dataKey="Pending"
            fill="oklch(85.2% 0.199 91.936)"
            stroke="oklch(85.2% 0.199 91.936)"
            activeBar={{ fill: "#fef9c3", stroke: "oklch(85.2% 0.199 91.936)" }}
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="BDRetained"
            name="BD Retained"
            fill="oklch(70.7% 0.165 254.624)"
            stroke="oklch(70.7% 0.165 254.624)"
            activeBar={{
              fill: "#dbeafe",
              stroke: "oklch(70.7% 0.165 254.624)",
            }}
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="Qualified"
            fill="#05df72"
            stroke="#05df72"
            activeBar={{ fill: "#dcfce7", stroke: "#05df72" }}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
