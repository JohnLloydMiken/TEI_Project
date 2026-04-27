import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // adjust to your authOptions path
import { prisma } from "@/lib/prisma"; // adjust to your prisma client path

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountNo } = await req.json();

    if (!accountNo) {
      return NextResponse.json(
        { error: "accountNo is required" },
        { status: 400 }
      );
    }

    // Get the user's DB id from session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the latest batch's customer with this accountNo
    const customer = await prisma.customer.findFirst({
      where: {
        accountNo,
        claimedAt: null, // only unclaimed
      },
      orderBy: {
        batch: { uploadedAt: "desc" },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found or already claimed" },
        { status: 404 }
      );
    }

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        claimedAt: new Date(),
        claimedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[CLAIM ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}