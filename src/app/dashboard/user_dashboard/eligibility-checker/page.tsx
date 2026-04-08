// src/app/dashboard/user_dashboard/eligibility_checker/page.tsx
"use client"; // ✅ needed because we're using a hook
import * as React from "react";
import { useState } from "react";
import useFetchQualifiedUsers from "@/services/useFetchQulifiedUsers";
import Widgets from "@/components/dashboard/eligibility-checker/widgets";
import IndividualChecker from "@/components/dashboard/eligibility-checker/individual-checker";
export default function EligibilityCheckerPage() {
  const [accountNo, setAccountNo] = useState("");
  const [query, setQuery] = useState(""); // ✅ only fetch on button click
  const { customer, loading, error } = useFetchQualifiedUsers(query);

  function handleCheck() {
    setQuery(accountNo.trim()); // ✅ triggers the useEffect in the hook
  }

  return (
    <div className="w-full flex flex-col gap-2">
        <div >
          <h1 className="text-2xl text-teiblue font-bold">Eligibility Checker</h1>
          <p className="text-lg text-gray-400 font-light">Dashboard / Checker / <span className="underline underline-offset-3">Individual</span></p>
        </div>
        <Widgets batch={"April 2026"} qualified={5} claimed={2}/>
        <IndividualChecker/>
    </div>
  );
}