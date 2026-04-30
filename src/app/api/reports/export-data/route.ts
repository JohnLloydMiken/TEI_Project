// src/app/api/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { computeDeadline } from "@/lib/deadlineLogic";

type FilterType = "all" | "eligible" | "claimed" | "expired";

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

  // Fetch batch info + all customers with their claimed user
  const batch = await prisma.uploadBatch.findUnique({
    where: { id: Number(batchId) },
    include: {
      customers: {
        include: {
          claimedUser: true,
        },
      },
    },
  });

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  // Derive status for each customer and apply filter
  const rows = batch.customers
    .map((c) => {
      const { status } = computeDeadline(
        c.notificationDate,
        c.claimedAt ?? null,
      );
      return { customer: c, status };
    })
    .filter(({ status }) => {
      if (filter === "all") return true;
      if (filter === "eligible") return status === "Eligible";
      if (filter === "claimed") return status === "Claimed";
      if (filter === "expired") return status === "Expired";
      return true;
    })
    .map(({ customer: c, status }) => ({
      "Account No": c.accountNo,
      "Customer Name": c.customerName,
      Address: c.address ?? "",
      Email: c.email ?? "",
      Phone: c.phone ?? "",
      "Deposit Amount": Number(c.depositAmount),
      "Notification Date": c.notificationDate.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      "Claimed At": c.claimedAt
        ? c.claimedAt.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      "Claimed By": c.claimedUser?.name ?? "",
      Status: status,
    }));

  // Build workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([["My Title"]]); // row 1

  XLSX.utils.sheet_add_json(ws, rows, {
    origin: "A2",
    skipHeader: false,
  });

  // --- Column widths ---
  ws["!cols"] = [
    { wch: 16 }, // Account No
    { wch: 28 }, // Customer Name
    { wch: 32 }, // Address
    { wch: 28 }, // Email
    { wch: 16 }, // Phone
    { wch: 16 }, // Deposit Amount
    { wch: 22 }, // Notification Date
    { wch: 22 }, // Claimed At
    { wch: 22 }, // Claimed By
    { wch: 12 }, // Status
  ];

  // --- Title row (A1 merged) ---
  const filterLabel: Record<FilterType, string> = {
    all: "All Customers",
    eligible: "Eligible Customers",
    claimed: "Claimed / Returned Customers",
    expired: "Expired Customers",
  };
  const title = `${batch.fileName} — ${filterLabel[filter]} (${batch.month}/${batch.year})`;
  XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: "A1" });

  const totalCols = 10;
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }];

  // --- Header style helper ---
  const headers = [
    "Account No",
    "Customer Name",
    "Address",
    "Email",
    "Phone",
    "Deposit Amount",
    "Notification Date",
    "Claimed At",
    "Claimed By",
    "Status",
  ];
  const colLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  // Style title cell
  if (ws["A1"]) {
    ws["A1"].s = {
      font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1E3A5F" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // Style header row (row 2 → index 1)
  colLetters.forEach((col, i) => {
    const cell = `${col}2`;
    if (ws[cell]) {
      ws[cell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial" },
        fill: { fgColor: { rgb: "2E6DA4" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        },
      };
    }
  });

  // Style data rows — zebra stripe + status color on Status column
  rows.forEach((row, rowIdx) => {
    const excelRow = rowIdx + 3; // data starts at row 3
    const isEven = rowIdx % 2 === 0;

    colLetters.forEach((col, colIdx) => {
      const cell = `${col}${excelRow}`;
      if (!ws[cell]) return;

      const isStatusCol = col === "J";
      const isAmountCol = col === "F";

      const statusColor: Record<string, string> = {
        Eligible: "217346", // green
        Claimed: "1F5C99", // blue
        Expired: "C0392B", // red
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
        numFmt: isAmountCol ? "#,##0.00" : undefined,
      };

      // Format deposit amount
      if (isAmountCol) {
        ws[cell].z = "#,##0.00";
      }
    });
  });

  // Row height for title
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
