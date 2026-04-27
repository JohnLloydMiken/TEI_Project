// services/useMarkAsClaimed.ts
import { useState } from "react";
import { toast } from "sonner";

export default function useMarkAsClaimed() {
  const [claimingIds, setClaimingIds] = useState<Set<number>>(new Set());

  async function markAsClaimed(
    customerId: number,
    accountNo: string,
    onSuccess?: (id: number) => void
  ): Promise<boolean> {
    setClaimingIds((prev) => new Set(prev).add(customerId));
    try {
      const res = await fetch("/api/action/claim", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNo }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to mark as claimed.");
        return false;
      }

      toast.success(`${accountNo} marked as claimed.`);
      onSuccess?.(customerId); // ← caller decides what to do with UI
      return true;
    } catch {
      toast.error("Something went wrong. Please try again.");
      return false;
    } finally {
      setClaimingIds((prev) => {
        const next = new Set(prev);
        next.delete(customerId);
        return next;
      });
    }
  }

  return { markAsClaimed, claimingIds };
}