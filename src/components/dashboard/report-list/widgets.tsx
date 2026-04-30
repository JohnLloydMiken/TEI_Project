"use client";
import { Users, CheckLine, Calendar1, Bookmark } from "lucide-react";
import { motion } from "motion/react";
interface WidgetsProp {
  batch: string | null;

  returned: number | string | null;
}

export default function ReturnedListWidgets({ batch, returned }: WidgetsProp) {
  return (
    <div className="w-1/2 grid grid-col-2 lg:flex lg:flex-row lg:justify-between lg:items-stretch gap-4">
      {[
        { label: "Active Batch", value: batch, Icon: Calendar1 },

        { label: "Already Returned", value: returned, Icon: CheckLine },
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
