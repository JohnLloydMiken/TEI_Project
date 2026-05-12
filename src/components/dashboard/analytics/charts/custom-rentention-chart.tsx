"use client";

import { PieChart, Pie, Cell } from "recharts";
import type { RetentionData } from "@/lib/data/charts-data";

// ─── Constants ───────────────────────────────────────────────────────────────
const W = 250;
const H = 140; // half-donut so chart height = roughly half width
const CX = W / 2;
const CY = H - 10; // pivot sits near the bottom center
const INNER_R = 70;
const OUTER_R = 120;

// Color zones: red → yellow → green
const ZONES = [
  { label: "Critical",  limit: 40,  fill: "#093C5D", stroke: "#ef4444" }, // red
  { label: "Moderate",  limit: 40,  fill: "#3B7597", stroke: "#f59e0b" }, // yellow
  { label: "Good",      limit: 20,  fill: "#6FD1D7", stroke: "#22c55e" }, // green
];

// The three arc segments always cover 0–40, 40–80, 80–100 (total = 100)
const ARC_DATA = [
  { value: 40, fill: "#093C5D", stroke: "#" }, // Soft Red/Border
  { value: 40, fill: "#3B7597", stroke: "  " }, // Soft Amber/Border
  { value: 20, fill: "#6FD1D7", stroke: "#" }, // Soft Green/Border
];

function getNeedleColor(rate: number) {
  if (rate <= 40) return "#093C5D"; // Red 500
  if (rate <= 80) return "#6FD1D7"; // Amber 500
  return "#088395"; // Emerald 500
}

function Needle({ rate }: { rate: number }) {
  // Map rate (0–100) to angle (180deg → 0deg, left to right)
  const angle = 180 - (rate / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const needleLen = INNER_R + (OUTER_R - INNER_R) / 2; // tip sits mid-arc
  const tipX = CX + needleLen * Math.cos(rad);
  const tipY = CY - needleLen * Math.sin(rad);
  const color = getNeedleColor(rate);

  return (
    <g>
      {/* Needle line */}
      <line
        x1={CX}
        y1={CY}
        x2={tipX}
        y2={tipY}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Pivot circle */}
      <circle cx={CX} cy={CY} r={6} fill={color} />
    </g>
  );
}

// ─── Rate label color ─────────────────────────────────────────────────────────
function getRateColor(rate: number) {
  if (rate <= 40) return "text-[#4988C4]";
  if (rate <= 80) return "text-[#4988C4]";
  return "text-[#4988C4]";
}

// ─── Month label helper ───────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  rate: number;
  batch: RetentionData["batch"];
}

export default function RetentionRateChart({ rate, batch }: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Gauge */}
      <div style={{ width: W }}>
        <PieChart width={W} height={H}>
          <Pie
            data={ARC_DATA}
            cx={CX}
            cy={CY}
            startAngle={180}
            endAngle={0}
            innerRadius={INNER_R}
            outerRadius={OUTER_R}
            dataKey="value"
            isAnimationActive={false}
            stroke="none"
          >
            {ARC_DATA.map((zone, i) => (
              <Cell key={i} fill={zone.fill} stroke={zone.stroke} strokeWidth={1} />
            ))}
          </Pie>

          {/* Needle rendered as custom SVG layer */}
          <Needle rate={rate} />
        </PieChart>
      </div>

      {/* Rate value */}
      <p className={`text-3xl font-bold  ${getRateColor(rate)}`}>
        {rate}%
      </p>

      {/* Min / Max labels */}
      <div className="flex justify-between w-full px-6 text-xs text-gray-400 font-medium -mt-1">
        <span>0</span>
        <span>100</span>
      </div>

      {/* Batch info */}
      {batch && (
        <p className="text-xs text-gray-400 mt-1">
          {MONTHS[batch.month - 1]} {batch.year} — {batch.retained} of {batch.total} customers retained
        </p>
      )}
    </div>
  );
}