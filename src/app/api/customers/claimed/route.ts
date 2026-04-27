import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  try {
    const claimed_customers = await prisma.customer.findMany({
      where: { claimedAt: { not: null } },
      
    });



    return NextResponse.json({ data: claimed_customers }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
