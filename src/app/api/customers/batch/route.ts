// src/app/api/customers/batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accountNumbers }: { accountNumbers: string[] } = body;
 
  if (!Array.isArray(accountNumbers) || accountNumbers.length === 0) {
    return NextResponse.json(
      { error: "Account Numbers must be a non-empty array" },
      { status: 400 }
    );
  }

  // Sanitize inputs
  const cleaned = accountNumbers
    .map((a) => a.trim())
    .filter(Boolean);

  try {
    // Single DB round-trip for all accounts
    const customers = await prisma.customer.findMany({
      where: { accountNo: { in: cleaned } },
      select: {
        id:               true,
        accountNo:        true,
        customerName:     true,
        accountCode: true,
        status: true, 
        batch: {
          select: {
            month:    true,
            year:     true,
            fileName: true,
          },
        },
      },
    });

    // Track which accounts were NOT found
    const foundAccountNos = new Set(customers.map((c) => c.accountNo));
    const notFound = cleaned.filter((a) => !foundAccountNos.has(a));

    // Enrich found customers with deadline logic
    const enriched = customers.map((customer) => {
      return {
        ...customer,        
          
      };
    });

    return NextResponse.json({
      data: {
        found:    enriched,
        notFound, // account numbers that don't exist in any batch
      },
    });

  } catch (err) {
    console.error("[POST /api/customers/batch]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}