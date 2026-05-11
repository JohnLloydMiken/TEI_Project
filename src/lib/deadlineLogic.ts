// src/lib/deadline.ts

export interface DeadlineInfo {
  deadlineDate: string;    // ISO string — safe to serialize over the wire
  daysRemaining: number;   // 0 if expired
  isExpired: boolean;
  status: "Pending" | "Expired" | "Retained";
}

export function computeDeadline(
  notificationDate: Date,
  claimedAt: Date | null
): DeadlineInfo {
  const deadline = getDeadline(notificationDate);
  const now = new Date();

  // Normalize both to "Start of Day" for a pure day-based count
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

  const msLeft = startOfDeadline.getTime() - startOfNow.getTime();
  const daysRemaining = Math.max(0, Math.floor(msLeft / (1000 * 60 * 60 * 24)));
  
  // A customer is expired only if today is strictly AFTER the deadline date
  const isExpired = startOfNow > startOfDeadline;

  // Status priority logic
  let status: "Pending" | "Expired" | "Retained" = "Pending";
  if (claimedAt) {
    status = "Retained";
  } else if (isExpired) {
    status = "Expired";
  }

  return {
    deadlineDate: deadline.toISOString(),
    daysRemaining: status === "Retained" ? 0 : daysRemaining,
    isExpired: status === "Expired", // Only true if NOT claimed and past date
    status,
  };
}

// Isolated so logic is testable separately
function getDeadline(notificationDate: Date): Date {
  const deadline = new Date(notificationDate);
  deadline.setMonth(deadline.getMonth() + 1);
  return deadline;
}