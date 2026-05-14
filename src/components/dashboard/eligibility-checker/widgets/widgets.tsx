"use client";
import { Users, UserCheck, Calendar1, UserCog } from "lucide-react";
import { motion } from "motion/react";
interface WidgetsProp {
  batch: string | null;
  qualified: number | string | null;
  pending: number | string | null;
  retained: number | string | null;
}

export default function Widgets({ batch, qualified, pending, retained }: WidgetsProp) {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:items-stretch gap-4">
      {[
        { label: "Active Batch", value: batch, Icon: Calendar1 },
        { label: "Total Qualified Customers", value: qualified, Icon: Users },
        { label: "Pending Customers", value: pending, Icon: UserCog },
        {
          label: "Total BD Retained ",
          value: retained,
          Icon: UserCheck,
        },
      ].map((item, idx) => (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          key={idx}
          //shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]
          className="relative flex-1 space-x-6 shadow-sm hover:shadow-lg  rounded-lg flex bg-white  items-center justify-center min-h-30"
        >
          <div className="flex flex-row items-center justify-center rounded-xl">
            <item.Icon color="#1a3a5c" size={44} strokeWidth={1.5} />
          </div>
          <div className=" flex flex-row justify-between items-center ">
            <div className="space-y-3 flex flex-col justify-center items-center">
              <p className=" md:text-sm text-xs text-gray-400 font-light whitespace-nowrap">
                {item.label}:
              </p>
              <h1 className="md:text-2xl text-xl text-teiblue font-bold leading-none">
                {item.value}
              </h1>
            </div>
          </div>
        </motion.div>
      ))}

      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative md:flex-1 w-full bg-white border border-gray-300/90 p-2 rounded-lg flex flex-col items-center justify-center"
      >
        {/* Label pinned to top-left */}
        <p className="absolute top-3 left-4 text-sm text-gray-400 font-medium">
          Status Legend:
        </p>

        {/* Content wrapper - centered with top padding to avoid label collision */}
        <div className="flex flex-row items-center justify-between gap-6 w-full pt-6">
          <ul className="grid grid-cols-2 gap-2 flex-1">
            <li className="px-3 py-1 bg-yellow-100 border border-yellow-400 rounded text-center">
              <span className="text-[10px] font-bold text-yellow-800 uppercase">
                Pending
              </span>
            </li>
            
            <li className="px-3 py-1 bg-blue-100 border border-blue-400 rounded text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase">
               BD Retained
              </span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
