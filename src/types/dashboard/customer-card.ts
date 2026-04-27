// types/dashboard/customer-card.ts
export interface CustomerCardProps {
  accountName: string | null;
  accountNumber: string | null;
  notifiedDate: Date | string | null;
  deadlineDate: Date | string | null;
  daysRemaining: number | null;
  depositAmount: number | string | null;
  status: string | null;
  onClear: () => void;
  onClaim: () => void;       // ← add
  claiming: boolean;         // ← add
}