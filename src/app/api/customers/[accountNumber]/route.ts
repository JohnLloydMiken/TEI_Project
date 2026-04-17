// src/app/api/customers/[accountNo]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeDeadline } from "@/lib/deadlineLogic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{accountNumber: string}> }
) {
  const { accountNumber } = await params;

  if (!accountNumber?.trim()) {
    return NextResponse.json(
      { error: "Account number is required" },
      { status: 400 }
    );
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: { accountNo: accountNumber, },
      select: {
        id:               true,
        accountNo:        true,
        customerName:     true,
        depositAmount:    true,
        notificationDate: true,
        claimedAt:        true,
        claimedBy:        true,
        batch: {
          select: {
            month:    true,
            year:     true,
            fileName: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // All deadline logic lives here — never on the client
    const deadlineInfo = computeDeadline(
      customer.notificationDate,
      customer.claimedAt ? new Date(customer.claimedAt) : null
    );

    return NextResponse.json({
      data: {
        ...customer,
        // Enrich the response with computed deadline fields
        deadlineDate:   deadlineInfo.deadlineDate,
        daysRemaining:  deadlineInfo.daysRemaining,
        isExpired:      deadlineInfo.isExpired,
        status:         deadlineInfo.status,
      },
    });

  } catch (err) {
    console.error("[GET /api/customers/:accountNumber]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}