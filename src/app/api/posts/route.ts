import { getPool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authorId = request.nextUrl.searchParams.get("authorId");

  if (!authorId) {
    return NextResponse.json({ error: "authorId is required" }, { status: 400 });
  }

  const pool = await getPool();
  const result = await pool.request()
    .input("authorId", authorId)
    .query("SELECT * FROM posts WHERE author_id = @authorId");

  return NextResponse.json(result.recordset, { status: 200 });
}