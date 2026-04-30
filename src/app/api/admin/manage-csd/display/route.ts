import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { claimed: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Flatten _count for cleaner response shape
    const shaped = users.map(({ _count, ...user }) => ({
      ...user,
      claimsProcessed: _count.claimed,
    }));

    return NextResponse.json(shaped, { status: 200 });
  } catch (e) {
    console.error("[GET /api/admin/manage-csd]", e);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}