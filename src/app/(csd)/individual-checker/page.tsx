"use client";
import { useEffect, useState } from "react";
import Widgets from "@/components/dashboard/eligibility-checker/widgets";
import IndividualChecker from "@/components/dashboard/eligibility-checker/individual-checker";

export default function EligibilityCheckerPage() {
  // Initialize with 0 to avoid layout shift
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [batch, setBatch] = useState("");
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers/all");

        if (!response.ok) throw new Error("Failed to Fetch");

        const result = await response.json();

        // Accessing result.data because of your API structure
        if (result.data && result.data.length > 0) {
          setCustomerCount(result.data.length);
          const batchDate = result.data[0].batch;
         
          const batchMonth = new Intl.DateTimeFormat("en-US", {
            month: "long",
          }).format(new Date(batchDate.year, batchDate.month - 1));
           const batchLabel = `${batchMonth} ${batchDate.year}`;
          setBatch(batchLabel);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []); // ✅ Empty dependency array prevents infinite loops

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-2xl text-teiblue font-bold">Eligibility Checker</h1>
        <p className="text-sm text-gray-400 font-light">
          Dashboard / Checker /{" "}
          <span className="underline underline-offset-3">Individual</span>
        </p>
      </div>

      <Widgets
        batch={batch}
        qualified={isLoading ? "..." : customerCount}
        claimed={2}
      />

      <IndividualChecker />
    </div>
  );
}
