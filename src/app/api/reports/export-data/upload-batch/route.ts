import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest){
  try {
    const uploadBatch = await prisma.uploadBatch.findMany();

    if (!uploadBatch) {
      return NextResponse.json(
        { error: "Failed to Access Upload Batch" },
        { status: 404 },
      );
    }
    return NextResponse.json(uploadBatch, { status: 200 });
  } catch (e){
    return NextResponse.json(
        { error: e },
        { status: 404 },
      );
  }
}
