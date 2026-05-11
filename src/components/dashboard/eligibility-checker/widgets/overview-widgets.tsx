import * as React from "react";
import { getAllCustomers, getCurrentBatch } from "@/lib/data/widgets-data";
import {
  Users,
  CheckLine,
  Calendar1,
  Bookmark,
  ListChevronsDownUpIcon,
} from "lucide-react";
export default async function OverviewWidgets() {
  const customer = await getAllCustomers();
  const batchDate = await getCurrentBatch()
  
  const batchMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(batchDate[0].batch.year, batchDate[0].batch.month - 1));
  const batchLabel = `${batchMonth} ${batchDate[0].batch.year}`;
  return (
    <div className="w-full grid grid-col-2 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:items-stretch gap-4">
      {[
        { label: "Active Batch", value: batchLabel, Icon: Calendar1 },
        { label: "Total Qualified Customers:", value: 10, Icon: Users },
        { label: "Pending Customers", value: 10, Icon: CheckLine },
        {
          label: "Total BD Retained: ",
          value: 5,
          Icon: ListChevronsDownUpIcon,
        },
      ].map((item, idx) => (
        <div
          key={idx}
          //shadow-[0_4px_10px_5px_rgb(0,0,0,0.08)]
          className="relative flex-1 space-x-6  border border-gray-300/90  rounded-lg flex bg-white  items-center justify-center min-h-30"
        >
          <div className="flex flex-row items-center justify-center rounded-xl">
            <item.Icon color="#1a3a5c" size={44} strokeWidth={1.5} />
          </div>
          <div className=" flex flex-row justify-between items-center ">
            <div className="space-y-3 flex flex-col justify-center items-center">
              <p className=" text-sm text-gray-400 font-light whitespace-nowrap">
                {item.label}:
              </p>
              <h1 className="text-2xl text-teiblue font-medium leading-none">
                {item.value}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
