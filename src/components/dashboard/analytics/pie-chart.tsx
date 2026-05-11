import * as React from "react";
import { User } from "lucide-react";
export interface PieChartProps {}

export default function PieChart(props: PieChartProps) {
  let yellow = 40, blue = 60 
  const total = yellow + blue
  const yellowPercent = (yellow / total) * 100
  return (
    <div className="flex-1 bg-white rounded-lg p-3 border border-gray-300/50">
      <div>
        <h1 className="text-teiblue font-medium text-xl">
          Eligible Customer Status:
        </h1>
      </div>
      {/* Pie chart 
      
      <div className="w-56 h-56 rounded-full bg-blue-100 border border-blue-400 mx-auto my-4 flex justify-center items-center ">
        <span className="text-lg text-teiblue font-medium">100%</span>
      </div>

      */}
      <div className="w-64 mx-auto">
        <div className="aspect-square rounded-full" style={{background: `conic-gradient(#fef9c2  0% ${yellowPercent}%, oklch(70.7% 0.165 254.624) ${yellowPercent}% 100%`}}/>
        <div className="flex justify-between mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            </div>
        </div>
      </div>
      {/* Label */}
      <div className=" flex flex-col justify-center items-start">
        <div className="flex flex-row justify-center items-center gap-2">
          <div className="bg-yellow-100 border-yellow-400 border p-1 w-1 h-1"></div>
          <div>
            {" "}
            <h1 className="text-sm font-medium text-teiblue">
              - Pending Customers
            </h1>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <div className="bg-blue-100 border border-blue-400 p-1 w-1 h-1"></div>
          <div>
            {" "}
            <h1 className="text-sm font-medium text-teiblue">
              {" "}
              - BD Retained Customers
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
