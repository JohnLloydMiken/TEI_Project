// app/api/bust-cache/route.ts
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateTag("historical-data", "default");
  return NextResponse.json({ success: true });
}