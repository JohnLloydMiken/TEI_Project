// src/lib/parseAccountExcel.ts
import * as XLSX from "xlsx";

const ACCEPTED_HEADERS = ["account no", "account number"];

export type ParseResult =
  | { ok: true; accountNumbers: string[]; totalRows: number }
  | { ok: false; error: string };

export async function parseAccountExcel(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (!rows || rows.length < 2) {
    return {
      ok: false,
      error: "The file appears to be empty or has no data rows.",
    };
  }

  // Normalize header row to lowercase for comparison
  const headerRow = rows[0].map((h) => String(h ?? "").trim().toLowerCase());

  const colIndex = headerRow.findIndex((h) => ACCEPTED_HEADERS.includes(h));

  if (colIndex === -1) {
    const found = rows[0].map((h) => `"${h}"`).join(", ");
    return {
      ok: false,
      error: `No account number column found. Headers detected: ${found}. Expected "Account No" or "Account Number".`,
    };
  }

  const accountNumbers = rows
    .slice(1)
    .map((row) => String(row[colIndex] ?? "").trim())
    .filter(Boolean);

  if (accountNumbers.length === 0) {
    return {
      ok: false,
      error: "The account number column was found but contains no data.",
    };
  }

  return {
    ok: true,
    accountNumbers,
    totalRows: accountNumbers.length,
  };
}