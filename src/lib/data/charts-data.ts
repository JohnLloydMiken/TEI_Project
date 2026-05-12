import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Historical Chart ────────────────────────────────────────────────────────

export const getHistoricalData = unstable_cache(
  async () => {
    const [grouped, batches] = await Promise.all([
      prisma.customer.groupBy({
        by: ["batchId", "status"],
        _count: { status: true },
      }),
      prisma.uploadBatch.findMany({
        orderBy: [{ year: "asc" }, { month: "asc" }],
        select: { id: true, month: true, year: true },
      }),
    ]);

    return batches.map((batch) => {
      const rows = grouped.filter((g) => g.batchId === batch.id);
      const get = (status: string) =>
        rows.find((r) => r.status === status)?._count.status ?? 0;

      return {
        name: MONTH_LABELS[batch.month - 1],
        Qualified: rows.reduce((sum, r) => sum + r._count.status, 0),
        BDRetained: get("BD Retained"),
        Pending: get("Pending"),
      };
    });
  },
  ["historical-data"],
  { revalidate: 60 * 60, tags: ["historical-data"] }
);

export type HistoricalDataPoint = Awaited<ReturnType<typeof getHistoricalData>>[number];

// ─── Retention Rate ──────────────────────────────────────────────────────────

export const getCurrentBatchRetentionRate = unstable_cache(
  async () => {
    const latestBatch = await prisma.uploadBatch.findFirst({
      orderBy: [{ year: "desc" }, { month: "desc" }],
      select: { id: true, month: true, year: true },
    });

    if (!latestBatch) return { rate: 0, batch: null };

    // Let DB do the counting — no customer rows in memory
    const [total, retained] = await Promise.all([
      prisma.customer.count({
        where: { batchId: latestBatch.id },
      }),
      prisma.customer.count({
        where: { batchId: latestBatch.id, status: "BD Retained" },
      }),
    ]);

    if (total === 0) return { rate: 0, batch: null };

    return {
      rate: Math.round((retained / total) * 100),
      batch: {
        month: latestBatch.month,
        year: latestBatch.year,
        total,
        retained,
      },
    };
  },
  ["retention-rate"],
  { revalidate: 60 * 60, tags: ["historical-data"] } // same tag — invalidates together
);

export type RetentionData = Awaited<ReturnType<typeof getCurrentBatchRetentionRate>>;