import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const returned_customers = await prisma.customer.findMany({
      where: { claimedAt: { not: null } },
      select: {
        id: true,
        accountNo: true,
        customerName: true,
        notificationDate: true,
        claimedAt: true,
        claimedUser: {
          select: { name: true },
        },
      },
      orderBy: { claimedAt: "desc" },
    });

    const shaped = returned_customers.map((c) => ({
      id: c.id,
      accountNo: c.accountNo,
      customerName: c.customerName,
      notificationDate: c.notificationDate,
      claimedAt: c.claimedAt,
      processedBy: c.claimedUser?.name ?? "—",
    }));

    return NextResponse.json(shaped, { status: 200 });
  } catch (e) {
    console.error("[GET /api/admin/returned]", e);
    return NextResponse.json(
      { error: "Failed to fetch returned customers." },
      { status: 500 }
    );
  }
}