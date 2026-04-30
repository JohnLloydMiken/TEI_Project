import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  let body: { fullName: string; email: string; password: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { fullName, email, password } = body;

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "fullName, email, and password are required." },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { error: "A user with that email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { name: fullName, email, password: hashedPassword },
    });

    // Never return the password hash to the client
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });

  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}