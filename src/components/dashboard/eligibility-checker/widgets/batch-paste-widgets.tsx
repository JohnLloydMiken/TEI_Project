"use client";
import { User, CheckLine, Bookmark, CircleX, SearchAlert, Clock, UserCheck2 } from "lucide-react";
import { motion } from "motion/react";
interface WidgetsProp {
  numberOfAcc: string | null | number;
  eligible: number | string | null;
  claimed: number | string | null;
  expired: number | string | null;
  notFound: number | string | null;
}

export default function BatchPasteWidgets({ numberOfAcc, eligible, claimed, expired, notFound }: WidgetsProp) {
  return (
    <div className="w-full grid grid-col-2 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:items-stretch gap-4">
      {[
        { label: "Account Entered", value: numberOfAcc, Icon: User,  borderColor: "border-t-white", color: "#1a3a5c" },
        { label: "Eligible", value: eligible, Icon: Bookmark , borderColor: "border-t-[#19b77d]" ,color: "green" },
        { label: "Claimed", value: claimed, Icon: UserCheck2 , borderColor: "border-t-tei-blue-lt", color: "#1a3a5c"},
        { label: "Expired", value: expired, Icon: Clock, borderColor: "border-t-[#e84545]", color: "#e84545"},
        { label: "Not Found", value: notFound, Icon: SearchAlert, borderColor: "border-t-gray-400", color: "gray" },
        
      ].map((item, idx) => (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          key={idx}
          className={`relative flex-1 bg-white shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]  p-4 rounded-lg flex  items-center justify-between min-h-32.5 border-t-3 ${item.borderColor}`}
        >
          <div className=" flex flex-col justify-between items-center gap-5">
            <p className=" text-sm text-gray-400 font-light whitespace-nowrap">
              {item.label}:
            </p>
            <h1 className="text-2xl text-teiblue font-bold leading-none">
              {item.value}
            </h1>
          </div>

          <div className="flex flex-row items-center justify-center gap-3">
            <item.Icon color={item.color} size={44} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}

     
    </div>
  );
}
