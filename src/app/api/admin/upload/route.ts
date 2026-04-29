/**
 * POST /api/admin/upload
 *
 * Accepts multipart/form-data with:
 *   - file: the Excel file (.xlsx / .xls)
 *   - month: number 1–12
 *   - year: four-digit number
 *
 * Business rules enforced here:
 *   1. Admin-only (checked via NextAuth session)
 *   2. If a batch already exists for (month, year) → delete it and all its customers, then replace
 *   3. If the file contains a duplicate account number → abort (handled in parser)
 *   4. All DB writes happen inside a single Prisma transaction
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { parseCustomerExcel } from "@/lib/xlsx/parse-excel";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Required for Buffer + SheetJS

export async function POST(req: NextRequest) {
  // ── 1. Auth guard ──────────────────────────────────────────────────────────
 console.log("🔥 upload route hit"); 
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  // ── 2. Parse form data ─────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const monthRaw = formData.get("month") as string | null;
  const yearRaw = formData.get("year") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!monthRaw || !yearRaw) {
    return NextResponse.json(
      { error: "Month and year are required." },
      { status: 400 },
    );
  }

  const month = parseInt(monthRaw, 10);
  const year = parseInt(yearRaw, 10);

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json(
      { error: "Month must be between 1 and 12." },
      { status: 400 },
    );
  }
  if (isNaN(year) || year < 2000 || year > 2100) {
    return NextResponse.json(
      { error: "Year is out of range." },
      { status: 400 },
    );
  }

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  console.log("file.type:", file.type);
  console.log("file.name:", file.name);
  console.log("file size:", file.size);
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    return NextResponse.json(
      { error: "Only .xlsx or .xls files are accepted." },
      { status: 400 },
    );
  }

  // ── 3. Read file into buffer & parse ──────────────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const parseResult = parseCustomerExcel(buffer);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error, rowIndex: parseResult.rowIndex ?? null },
      { status: 422 },
    );
  }

  const { rows } = parseResult;
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "The file contains no customer rows." },
      { status: 422 },
    );
  }

  const adminId = parseInt(session.user.id as string, 10);

  // ── 4. Transaction: delete existing batch (if any) → create new ───────────
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find existing batch for this month/year
      const existing = await tx.uploadBatch.findFirst({
        where: { month, year },
        select: { id: true },
      });

      if (existing) {
        // Delete all customers in old batch first (FK constraint)
        await tx.customer.deleteMany({ where: { batchId: existing.id } });
        await tx.uploadBatch.delete({ where: { id: existing.id } });
      }

      // Create new batch
      const batch = await tx.uploadBatch.create({
        data: {
          fileName: file.name,
          uploadedBy: adminId,
          month,
          year,
        },
      });

      // Bulk-insert customers
      await tx.customer.createMany({
        data: rows.map((r) => ({
          accountNo: r.accountNo,
          customerName: r.customerName,
          address: r.address,
          email: r.email,
          phone: r.phone,
          depositAmount: r.depositAmount,
          notificationDate: r.notificationDate,
          batchId: batch.id,
        })),
      });

      return {
        batchId: batch.id,
        totalInserted: rows.length,
        replaced: !!existing,
      };
    });

    return NextResponse.json({
      success: true,
      message: result.replaced
        ? `Existing batch for ${month}/${year} was replaced. ${result.totalInserted} customers imported.`
        : `${result.totalInserted} customers imported successfully.`,
      batchId: result.batchId,
      totalInserted: result.totalInserted,
      replaced: result.replaced,
    });
  } catch (err: unknown) {
    console.error("[upload] DB error:", err);

    // Catch unique constraint violation (shouldn't happen after parser check, but be safe)
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "Duplicate account number detected during database write. Upload aborted.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 },
    );
  }
}
