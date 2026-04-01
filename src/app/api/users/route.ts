import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const pool = await getPool();
  const result = await pool.request().query("SELECT *  FROM Users");
  return NextResponse.json(result.recordset, { status: 200 });
}
