import { prisma } from "@/lib/prisma";
import { Customer } from "@/types/customer";
import { getCurrentBatch } from "@/lib/data/widgets-data";

const PAGE_SIZE = 10;

export async function getAllCustomers({
  page = 1,
  status,
}: {
  page?: number;
  status?: "Pending" | "BD Retained";
} = {}) {
  // ① Scope to latest batch
  const latestBatch = await getCurrentBatch();
  if (!latestBatch) return { customers: [], total: 0, pageCount: 0, page };

  const where = {
    batchId: latestBatch.id,
    ...(status ? { status } : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: [{ customerName: "asc" }],
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    // ② Explicit Customer type + Decimal → number conversion
    customers: customers.map((c): Customer => ({
      id: c.id,
      accountCode: c.accountCode,
      accountNo: c.accountNo,
      customerName: c.customerName,
      status: c.status,
      address: c.address,
      email: c.email,
      phone: c.phone,
      depositAmount: c.depositAmount ? c.depositAmount.toNumber() : null,
      batchId: c.batchId,
    })),
    total,
    pageCount: Math.ceil(total / PAGE_SIZE),
    page,
  };
}