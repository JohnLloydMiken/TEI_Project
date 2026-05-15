import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";


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
  depositAmount: number | null;
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
    const latestBatch = await prisma.uploadBatch.findFirst({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    select: { id: true },
  });

  if (!latestBatch) return { customers: [], total: 0, pageCount: 0, page };

  // ② Scope the where clause to that batchId
  const where = {
    batchId: latestBatch.id,
    ...(status ? { status } : {}),
  };

   const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: [{ customerName: "asc" }], // ③ fixed: array form for clarity
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
    customers: customers.map((c) => ({
      ...c,
      // ✅ Convert Decimal → number | null before crossing the server/client boundary
      depositAmount: c.depositAmount ? c.depositAmount.toNumber() : null,
    })),
    total,
    pageCount: Math.ceil(total / PAGE_SIZE),
    page,
  };
}

// ─── Overview Widget Counts ──────────────────────────────────────────────────
// Replaces the old getAllCustomers that fetched everything just to count



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

export const getCustomerCounts = unstable_cache(
  async () => {
    const latestBatch = await getCurrentBatch(); // ✅ hits cache, no extra query

    if (!latestBatch) return { total: 0, bdRetained: 0, pending: 0 };

    const batchWhere = { batchId: latestBatch.id };

    const [total, bdRetained, pending] = await Promise.all([
      prisma.customer.count({ where: batchWhere }),
      prisma.customer.count({ where: { ...batchWhere, status: "BD Retained" } }),
      prisma.customer.count({ where: { ...batchWhere, status: "Pending" } }),
    ]);

    return { total, bdRetained, pending };
  },
  ["customer-counts"],
  { revalidate: 60, tags: ["customers-counts"] }
);