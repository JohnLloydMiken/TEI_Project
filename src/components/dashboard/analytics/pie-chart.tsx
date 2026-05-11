// components/dashboard/customer-pie-section.tsx
import { getAllCustomers } from "@/lib/data/widgets-data";
import CustomerPieChart from "./charts/customer-pie-chart";
import { div } from "motion/react-client";

export default async function CustomerPieSection() {
  const { BDRetained, Pending } = await getAllCustomers();

  return (
    <div className="flex-1 bg-white rounded-lg  shadow-sm hover:shadow-lg p-3">
      <h1 className="text-xl text-teiblue font-medium">
        Eligible Customer Status:
      </h1>
      <div className="w-full flex justify-center items-center">
        <CustomerPieChart
          bdRetainedCount={BDRetained.length}
          pendingCount={Pending.length}
        />
      </div>
      <div className="w-full mx-auto flex justify-center items-center space-x-6">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2  bg-yellow-100 border border-yellow-400"/>
          <p className="text-sm font-normal text-teiblue"> - Pending</p>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2  bg-blue-100 border border-blue-400"/>
          <p className="text-sm font-normal text-teiblue"> - BD Retained</p>
        </div>
      </div>
    </div>
  );
}
