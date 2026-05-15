"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export type CheckedCustomer = {
  id: number;
  accountNo: string;
  accountCode: string;
  customerName: string;
  status: string;
  batchId: number;
  batch: { month: number; year: number; fileName: string };
};

export type CheckResult = {
  found: CheckedCustomer[];
  notFound: string[];
};

/**
 * Pure lookup — reads accountNos from the checker Excel,
 * matches them against the existing Customer masterlist.
 * No records are created or deleted.
 */
export async function checkBatchAccountsAction(
  accountNos: string[],
): Promise<
  { success: true; result: CheckResult } | { success: false; error: string }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthenticated" };

  const deduped = [...new Set(accountNos.map((n) => n.trim()).filter(Boolean))];

  try {
    const matched = await prisma.customer.findMany({
      where: { accountNo: { in: deduped } },
      select: {
        id: true,
        accountNo: true,
        accountCode: true,
        customerName: true,
        status: true,
        batchId: true,
        batch: {
          select: { month: true, year: true, fileName: true },
        },
      },
    });

    const matchedNos = new Set(matched.map((c) => c.accountNo.trim()));
    const notFound = deduped.filter((no) => !matchedNos.has(no));

    return { success: true, result: { found: matched, notFound } };
  } catch (err) {
    console.error("[checkBatchAccountsAction]", err);
    return { success: false, error: "Failed to look up accounts." };
  }
}

/**
 * Flips Pending ↔ BD Retained and writes a CustomerLog entry.
 * The only mutation the checker is allowed to perform.
 */
export async function toggleCustomerStatusAction(
  customerId: number,
): Promise<
  { success: true; newStatus: string } | { success: false; error: string }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthenticated" };

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, status: true, accountNo: true },
    });

    if (!customer) return { success: false, error: "Customer not found." };

    const fromStatus = customer.status;
 
    const toStatus = fromStatus === "Pending" ? "BD Retained" : "Pending";
    const action = toStatus === "BD Retained" ? "TAGGED" : "UNTAGGED";

    await prisma.$transaction([
      prisma.customer.update({
        where: { id: customerId },
        data: { status: toStatus },
      }),
      prisma.customerLog.create({
        data: {
          customerId,
          action,
          fromStatus,
          toStatus,
          performedBy: Number(session.user.id),
        },
      }),
    ]);
    revalidateTag("historical-data", "default");
    revalidatePath("/batch-checker/upload");
    return { success: true, newStatus: toStatus };
  } catch (err) {
    console.error("[toggleCustomerStatusAction]", err);
    return { success: false, error: "Failed to update status." };
  }
}

export async function bustHistoricalCache() {
  revalidateTag("historical-data", "default");
}
