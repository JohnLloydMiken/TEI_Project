// src/app/api/customer/[accountNumber]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> },
) {
  const { accountNumber } = await params;
  console.log("Received accountNumber:", accountNumber); // ← add this

  if (!accountNumber) {
    return NextResponse.json(
      { error: "Account number is required" },
      { status: 400 },
    );
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: {
        accountNo: accountNumber,
        
      },
      include: {
        batch: {
          select: {
            month: true,
            year: true,
            fileName: true,
          },
        },
      },
    });
    console.log("2. Prisma result:", customer); // ← is this null?
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: customer }, { status: 200 });
  } catch (e) {
     console.error("3. Error:", e);
    console.error("GET /api/customers/[accountNumber] error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
