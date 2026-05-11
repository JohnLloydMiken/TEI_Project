export interface Customer {
  id: number;
  accountNo: string;
  customerName: string;
  depositAmount: string;
  notificationDate: string;
  claimedAt: string | null;
  claimedBy: number | null;
  batch: {
    month: number;
    year: number;
    fileName: string;
  };
  deadlineDate: string;
  daysRemaining: number;
  isExpired: Boolean;
  status: "Pending" | "BD Retained";
}

export interface FetchCustomer {
  result: Customer[];
  isLoading: boolean;
  error: string | null;
}
