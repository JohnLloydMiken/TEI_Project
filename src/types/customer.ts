// @/types/customer.ts — keep depositAmount as number | null
export interface Customer {
  id: number;
  accountCode: string;
  accountNo: string;
  customerName: string;
  status: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  depositAmount: number | null; // ✅ serialized, not Decimal
  batchId: number;
}