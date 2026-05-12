import { Decimal } from "@prisma/client/runtime/client";

export interface Customer{
    id: number;
    accountCode: string;
    accountNo: string;
    customerName: string;
    status: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    depositAmount: Decimal | null;
    batchId: number;
}

export interface FetchCustomer {
  result: Customer[];
  isLoading: boolean;
  error: string | null;
}
