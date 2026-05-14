import * as React from "react";
import { getCustomerCounts, getCurrentBatch } from "@/lib/data/widgets-data";
import { Users, UserCheck, Calendar1, UserCog } from "lucide-react";

export default async function OverviewWidgets() {
  const [counts, batch] = await Promise.all([
    getCustomerCounts(),
    getCurrentBatch(),
  ]);

  const batchLabel = batch
    ? `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(batch.year, batch.month - 1)
      )} ${batch.year}`
    : "No batch yet";

  const widgets = [
    { label: "Active Batch",               value: batchLabel,       Icon: Calendar1 },
    { label: "Total Qualified Customers",  value: counts.total,     Icon: Users     },
    { label: "Pending Customers",          value: counts.pending,   Icon: UserCheck },
    { label: "Total BD Retained",          value: counts.bdRetained,Icon: UserCog   },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:items-stretch gap-2 md:gap-10">
      {widgets.map(({ label, value, Icon }) => (
        <div
          key={label}
          className="relative flex-1 space-x-2 md:space-x-6  shadow-sm hover:shadow-lg rounded-lg flex bg-white items-center justify-center min-h-30"
        >
          <div className="flex flex-row items-center justify-center rounded-xl">
            <Icon color="#1a3a5c" size={44} strokeWidth={1.5} />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="space-y-3 flex flex-col justify-center items-center">
              <p className="md:text-sm text-xs text-gray-400 font-light whitespace-nowrap">
                {label}:
              </p>
              <h1 className="lg:text-2xl text-xl text-teiblue font-medium leading-none">
                {value}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}