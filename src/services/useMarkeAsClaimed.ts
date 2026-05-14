// services/useMarkAsClaimed.ts
"use client";
import { useState } from "react";
import { toggleCustomerStatusAction } from "@/lib/actions/batch"; // adjust path
import { toast } from "sonner";

export default function useMarkAsClaimed() {
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());

  async function markAsClaimed(
    customerId: number,
    accountNo: string,
    onSuccess?: () => void
  ) {
    setClaimingIds((prev) => new Set(prev).add(customerId));

    const result = await toggleCustomerStatusAction(customerId);

    if (result.success) {
      toast.success(`${accountNo} → ${result.newStatus}`);
      onSuccess?.();
    } else {
      toast.error(result.error);
    }

    setClaimingIds((prev) => {
      const next = new Set(prev);
      next.delete(customerId);
      return next;
    });
  }

  return { markAsClaimed, claimingIds };
}