import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

type FilterType = "all" | "BDRetained" | "Pending";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get("batchId");
  const filter = (searchParams.get("filter") ?? "all") as FilterType;

  if (!batchId || isNaN(Number(batchId))) {
    return NextResponse.json(
      { error: "Invalid or missing batchId" },
      { status: 400 },
    );
  }

  const batch = await prisma.uploadBatch.findUnique({
    where: { id: Number(batchId) },
    include: {
      customers: true, // no longer need claimedUser relation
    },
  });

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  // Filter by status field directly
  const filtered = batch.customers.filter((c) => {
    if (filter === "all") return true;
    if (filter === "BDRetained") return c.status === "BD Retained";
    if (filter === "Pending") return c.status === "Pending";
    return true;
  });

  const rows = filtered.map((c) => ({
    "Account Code": c.accountCode,
    "Account No": c.accountNo,
    "Customer Name": c.customerName,
    Address: c.address ?? "",
    Email: c.email ?? "",
    Phone: c.phone ?? "",
    "Deposit Amount": c.depositAmount ? Number(c.depositAmount) : "",
    Status: c.status,
  }));

  // Build workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([["placeholder"]]);

  XLSX.utils.sheet_add_json(ws, rows, {
    origin: "A2",
    skipHeader: false,
  });

  // Column widths
  ws["!cols"] = [
    { wch: 16 }, // Account Code
    { wch: 16 }, // Account No
    { wch: 28 }, // Customer Name
    { wch: 32 }, // Address
    { wch: 28 }, // Email
    { wch: 16 }, // Phone
    { wch: 16 }, // Deposit Amount
    { wch: 14 }, // Status
  ];

  // Title row
  const filterLabel: Record<FilterType, string> = {
    all: "All Customers",
    BDRetained: "BD Retained Customers",
    Pending: "Pending Customers",
  };
  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const title = `${batch.fileName} — ${filterLabel[filter]} (${MONTHS[batch.month - 1]} ${batch.year})`;
  XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "A1" });

  const totalCols = 8;
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];

  const colLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Style title cell
  if (ws["A1"]) {
    ws["A1"].s = {
      font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1E3A5F" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Style header row (row 2)
  colLetters.forEach((col) => {
    const cell = `${col}2`;
    if (ws[cell]) {
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial" },
        fill: { fgColor: { rgb: "2E6DA4" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { bottom: { style: "thin", color: { rgb: "FFFFFF" } } },
      };
    }
  });

  // Style data rows
  rows.forEach((row, rowIdx) => {
    const excelRow = rowIdx + 3;
    const isEven = rowIdx % 2 === 0;

    colLetters.forEach((col) => {
      const cell = `${col}${excelRow}`;
      if (!ws[cell]) return;

      const isStatusCol = col === "H";
      const isAmountCol = col === "G";

      const statusColor: Record<string, string> = {
        "BD Retained": "217346", // green
        Pending:       "C07A00", // amber
      };

      ws[cell].s = {
        font: {
          name: "Arial",
          sz: 10,
          bold: isStatusCol,
          color: isStatusCol
            ? { rgb: statusColor[row.Status] ?? "000000" }
            : { rgb: "000000" },
        },
        fill: { fgColor: { rgb: isEven ? "EBF2FA" : "FFFFFF" } },
        alignment: {
          horizontal: isAmountCol ? "right" : isStatusCol ? "center" : "left",
          vertical: "center",
        },
      };

      if (isAmountCol) {
        ws[cell].z = "#,##0.00";
      }
    });
  });

  ws["!rows"] = [{ hpt: 28 }, { hpt: 20 }];

  XLSX.utils.book_append_sheet(wb, ws, "Customers");

  const buf = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
    cellStyles: true,
  });

  const safeName = batch.fileName.replace(/[^a-z0-9_\-]/gi, "_");
  const filename = `${safeName}_${filter}_${batch.year}_${String(batch.month).padStart(2, "0")}.xlsx`;

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}