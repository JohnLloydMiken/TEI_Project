interface DeadlineProps {
  notificationDate: string | number | Date;
  claimDate: string | number | Date;
}

export default function Deadline({
  notificationDate,
  claimDate,
}: DeadlineProps): boolean {
  const start = new Date(notificationDate);
  const claim = new Date(claimDate);

  // Create the deadline by adding exactly 1 month to the notification date
  const deadline = new Date(start);
  deadline.setMonth(start.getMonth() + 1);

  // Compare the raw time values (milliseconds)
  const isValid = claim.getTime() <= deadline.getTime();

  if (!isValid) {
    console.log("Your eligibility has expired");
    return false;
  }

  console.log("You can claim your eligibility");
  return true;
}