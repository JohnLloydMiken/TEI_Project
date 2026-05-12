import { prisma } from "@/lib/prisma";
const PAGE_SIZE = 10;

export async function getAllCustomers({
  page = 1,
  status,
}: {
  page?: number;
  status?: "Pending" | "BD Retained";
}) {
  const where = status ? { status } : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { customerName: "asc" },
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
