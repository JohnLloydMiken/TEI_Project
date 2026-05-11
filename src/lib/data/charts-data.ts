import { prisma } from "@/lib/prisma";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function getHistoricalData() {
  const batches = await prisma.uploadBatch.findMany({
    include: { customers: true },
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  return batches.map((batch) => {
    const qualified = batch.customers.length;
    const bdRetained = batch.customers.filter((c) => c.status === "BD Retained").length;
    const pending = batch.customers.filter((c) => c.status === "Pending").length;

    return {
      name: MONTH_LABELS[batch.month - 1],  // month is 1-indexed
      Qualified: qualified,
      BDRetained: bdRetained,
      Pending: pending,
    };
  });
}

export type HistoricalDataPoint = Awaited<ReturnType<typeof getHistoricalData>>[number];

export async function getCurrentBatchRetentionRate() {
  const latestBatch = await prisma.uploadBatch.findFirst({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { customers: true },
  });

  if (!latestBatch || latestBatch.customers.length === 0) return { rate: 0, batch: null };

  const total = latestBatch.customers.length;
  const retained = latestBatch.customers.filter((c) => c.status === "BD Retained").length;
  const rate = Math.round((retained / total) * 100);

  return {
    rate,
    batch: {
      month: latestBatch.month,
      year: latestBatch.year,
      total,
      retained,
    },
  };
}

export type RetentionData = Awaited<ReturnType<typeof getCurrentBatchRetentionRate>>;