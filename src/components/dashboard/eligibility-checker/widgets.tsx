"use client";
import { Users, CheckLine, Calendar1, Bookmark } from "lucide-react";

interface WidgetsProp {
  batch: string | null;
  qualified: number | string | null;
  claimed: number | string | null;
}

export default function Widgets({ batch, qualified, claimed }: WidgetsProp) {
  return (
    <div className="w-full flex flex-row justify-between items-stretch gap-4">
      
      {/* Data Cards */}
      {[
        { label: "Active Batch", value: batch, Icon: Calendar1 },
        { label: "Qualified Customers", value: qualified, Icon: Users },
        { label: "Already Claimed", value: claimed, Icon: CheckLine },
      ].map((item, idx) => (
        // Added 'relative' and 'min-h-[120px]' to ensure enough room for the center
        <div key={idx} className="relative flex-1 bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center min-h-[130px]">
          
          {/* Label pinned to top-left using absolute */}
          <p className="absolute top-3 left-4 text-sm text-gray-400 font-medium whitespace-nowrap">
            {item.label}:
          </p>
          
          {/* Value and Icon - now truly centered in the container */}
          <div className="flex flex-row items-center gap-3">
            <h1 className="text-3xl text-teiblue font-bold leading-none">{item.value}</h1>
            <item.Icon color="#1a3a5c" size={50} strokeWidth={1} />
          </div>
        </div>
      ))}

      {/* Status Legend - flex-[2] */}
      <div className="relative flex-[2] bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center justify-center">
        {/* Label pinned to top-left */}
        <p className="absolute top-3 left-4 text-sm text-gray-400 font-medium">Status Legend:</p>
        
        {/* Content wrapper - centered with top padding to avoid label collision */}
        <div className="flex flex-row items-center justify-between gap-6 w-full pt-6">
          <ul className="grid grid-cols-2 gap-2 flex-1">
            <li className="px-3 py-1 bg-green-100 border border-green-200 rounded text-center">
              <span className="text-[10px] font-bold text-green-800 uppercase">Eligible</span>
            </li>
            <li className="px-3 py-1 bg-red-100 border border-red-200 rounded text-center">
              <span className="text-[10px] font-bold text-red-800 uppercase">Claimed</span>
            </li>
            <li className="px-3 py-1 bg-blue-100 border border-blue-200 rounded text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Expired</span>
            </li>
            <li className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-center">
              <span className="text-[10px] font-bold text-gray-800 uppercase">Not found</span>
            </li>
          </ul>
          
          <Bookmark color="#1a3a5c" size={40} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}