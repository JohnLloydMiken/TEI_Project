import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // adjust to your authOptions path
import { prisma } from "@/lib/prisma"; // adjust to your prisma client pa

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Get the user's DB id from session email
    const user = await prisma.user.update({
        where: {email: email},
        data: {
            email: "admin@123",
            name: ""
        }
    })

  } catch {

  }
}
