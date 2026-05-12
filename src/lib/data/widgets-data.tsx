import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";

const PAGE_SIZE = 20;

export interface Customer {
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

// ─── Customer List (paginated) ───────────────────────────────────────────────

export async function getAllCustomers({
  page = 1,
  status,
}: {
  page?: number;
  status?: "Pending" | "BD Retained";
} = {}) {
  const where = status ? { status } : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { customerName: "asc" },
      select: {
        id: true,
        accountCode: true,
        accountNo: true,
        customerName: true,
        status: true,
        address: true,
        email: true,
        phone: true,
        depositAmount: true,
        batchId: true,
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    customers,
    total,
    pageCount: Math.ceil(total / PAGE_SIZE),
    page,
  };
}

// ─── Overview Widget Counts ──────────────────────────────────────────────────
// Replaces the old getAllCustomers that fetched everything just to count

export const getCustomerCounts = unstable_cache(
  async () => {
    const [total, bdRetained, pending] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: "BD Retained" } }),
      prisma.customer.count({ where: { status: "Pending" } }),
    ]);

    return { total, bdRetained, pending };
  },
  ["customer-counts"],
  { revalidate: 60, tags: ["customers-list"] }
);

// ─── Current Batch ───────────────────────────────────────────────────────────

export const getCurrentBatch = unstable_cache(
  async () => {
    const latestBatch = await prisma.uploadBatch.findFirst({
      orderBy: [{ year: "desc" }, { month: "desc" }],
      select: {
        id: true,
        fileName: true,
        month: true,
        year: true,
        uploadedAt: true,
      },
    });

    return latestBatch;
  },
  ["current-batch"],
  { revalidate: 60 * 60, tags: ["current-batch"] }
);