// types/dashboard/customer-card.ts
export interface CustomerCardProps {
  accountName: string | null;
  accountNumber: string | null;
  accountCode:string,
  status: string | null;
  onClear: () => void;
  onClaim: () => void;       // ← add
  claiming: boolean;         // ← add
}