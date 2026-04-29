"use client";
import { Users } from "lucide-react";
import { motion } from "motion/react";
interface WidgetsProp {

  CSDUser: number | string 
}

export default function CSDWidgets({ CSDUser }: WidgetsProp) {
  return (
    <div className="w-1/5 grid grid-col-1">
      {[
        { label: "Total CSD User", value: CSDUser, Icon: Users },
      
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
            <item.Icon color="white" size={44} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
