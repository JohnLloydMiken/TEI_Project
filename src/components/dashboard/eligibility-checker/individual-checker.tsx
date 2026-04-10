"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Deadline from "@/lib/deadlineLogic";
export default function IndividualChecker() {
  const pathname = usePathname();
  const inidvidualPath = "/dashboard/user_dashboard/eligibility-checker";
  const batchPath = "/dashboard/user_dashboard/batch_checker/upload";
  console.log(
    "Normal case (Within month):",
    Deadline("2026-01-01", "2026-01-15"),
  ); // Expected: true
  console.log(
    "Year rollover (Dec to Jan):",
    Deadline("2025-12-15", "2026-01-10"),
  ); // Expected: true
  console.log("Expired case:", Deadline("2026-01-01", "2026-02-05")); // Expected: false
  return (
    <div className="w-full rounded-lg bg-white border border-gray-200 flex flex-col ">
      <div className="flex flex-col">
        <div className="bg-teiblue p-4 flex flex-row justify-between items-center rounded-t-lg">
          <p className="text-white text-xl">Individual Checker</p>
          <p className="text-white/60 text-lg/">
            Enter account number to verify
          </p>
        </div>
        <div className="flex-1 border-b border-b-gray-200">
          <ul className="flex flex-row justify-start items-center space-x-4 ">
            <li
              className={`group p-4 hover:border-b-4 hover:border-b-teiorange ${pathname === inidvidualPath ? "border-b-4 border-b-teiorange" : "border-none"}`}
            >
              <Link
                href={inidvidualPath}
                className={`text-lg group-hover:text-teiorange  ${pathname === inidvidualPath ? "text-teiorange" : "text-gray-300"}`}
              >
                Individual
              </Link>
            </li>
            <li className="group  p-4">
              <Link
                href={batchPath}
                className={`text-lg group-hover:text-teiorange  ${pathname === batchPath ? "text-teiorange" : "text-gray-300"}`}
              >
                Batch (paste)
              </Link>
            </li>
            <li className="group  p-4">
              <Link
                href={batchPath}
                className={`text-lg group-hover:text-teiorange  ${pathname === batchPath ? "text-teiorange" : "text-gray-300"}`}
              >
                Batch (upload)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="w-full">
          <div className="w-9/12 flex flex-row items-center  gap-3 p-3 mx-auto   ">
            <input
              type="text"
              name="customer-search"
              className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-100 outline-none"
              placeholder="Account number (e.g. TEI-00001)"
            />
            <button className="shrink-0 flex flex-row justify-center items-center gap-2 border border-gray-200 p-3 rounded-lg bg-teiblue text-white text-lg">
              Search <Search color="white" />
            </button>
          </div>
        </div>
      </div>

      <div className=" p-4 flex-1 flex-col space-y-4">
        <hr className="bg-gray-400 text-gray-300" />
        <p className="text-center text-sm uppercase text-gray-500">
          your results are here
        </p>
      </div>
    </div>
  );
}
