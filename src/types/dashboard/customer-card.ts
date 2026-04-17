export interface CustomerCardProps {
  accountName:    string | null | undefined;
  accountNumber:  string | number | null | undefined;
  notifiedDate:   Date | string | null ;
  deadlineDate:   Date | string | null ;
  daysRemaining:     number | string | null ; // days left (number works best for progress calc)
  depositAmount:  number | string | null ;
  status:         "Eligible" | "Not Found" | "Claimed" | "Expired" | null;
  totalDays?:     number; // optional, defaults to 30
  onClear: ()=> void
}