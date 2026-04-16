"use client";
import { Users, CheckLine, Calendar1, Bookmark } from "lucide-react";
import { motion } from "motion/react";
interface WidgetsProp {
  batch: string | null;
  qualified: number | string | null;
  claimed: number | string | null;
}

export default function Widgets({ batch, qualified, claimed }: WidgetsProp) {
  return (
    <div className="w-full grid grid-col-2 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:items-stretch gap-4">
      {[
        { label: "Active Batch", value: batch, Icon: Calendar1 },
        { label: "Qualified Customers", value: qualified, Icon: Users },
        { label: "Already Claimed", value: claimed, Icon: CheckLine },
      ].map((item, idx) => (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          key={idx}
          className="relative flex-1 bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]  p-4 rounded-lg flex  items-center justify-between min-h-32.5"
        >
          <div className=" flex flex-col justify-between items-center gap-5">
            <p className=" text-sm text-gray-400 font-light whitespace-nowrap">
              {item.label}:
            </p>
            <h1 className="text-2xl text-teiblue font-bold leading-none">
              {item.value}
            </h1>
          </div>

          <div className="flex flex-row items-center justify-center gap-3 bg-teiblue shadow-[0_4px_10px_0_rgba(59,130,246,0.4)] p-2 rounded-xl">
            <item.Icon color="white" size={50} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}

      {/* Status Legend - flex-[2] */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative flex-2 bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)] p-4 rounded-lg flex flex-col items-center justify-center"
      >
        {/* Label pinned to top-left */}
        <p className="absolute top-3 left-4 text-sm text-gray-400 font-medium">
          Status Legend:
        </p>

        {/* Content wrapper - centered with top padding to avoid label collision */}
        <div className="flex flex-row items-center justify-between gap-6 w-full pt-6">
          <ul className="grid grid-cols-2 gap-2 flex-1">
            <li className="px-3 py-1 bg-green-100 border border-green-400 rounded text-center">
              <span className="text-[10px] font-bold text-green-800 uppercase">
                Eligible
              </span>
            </li>
            <li className="px-3 py-1 bg-red-100 border border-red-400 rounded text-center">
              <span className="text-[10px] font-bold text-red-800 uppercase">
                Claimed
              </span>
            </li>
            <li className="px-3 py-1 bg-blue-100 border border-blue-400 rounded text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase">
                Expired
              </span>
            </li>
            <li className="px-3 py-1 bg-gray-100 border border-gray-400 rounded text-center">
              <span className="text-[10px] font-bold text-gray-800 uppercase">
                Not found
              </span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
