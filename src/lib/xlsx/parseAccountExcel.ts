// src/lib/parseAccountExcel.ts
import * as XLSX from "xlsx";

// Matches the real header exactly as it appears in the file
const ACCOUNT_HEADER_VARIANTS = ["account_no", "account no"];

export type ParseResult =
  | { ok: true; accountNumbers: string[]; totalRows: number }
  | { ok: false; error: string };

export async function parseAccountExcel(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // header: 1 gives a raw 2D array — no automatic header mapping
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (!rows || rows.length < 3) {
    // Need at least: title row + header row + 1 data row
    return {
      ok: false,
      error: "The file appears to be empty or has no data rows.",
    };
  }

  // ── Row 0 is the report title label — skip it
  // ── Row 1 is the actual header row
  const headerRow = rows[1].map((h) => String(h ?? "").trim().toLowerCase());

  const colIndex = headerRow.findIndex((h) =>
    ACCOUNT_HEADER_VARIANTS.includes(h)
  );

  if (colIndex === -1) {
    const found = rows[1].map((h) => `"${h}"`).join(", ");
    return {
      ok: false,
      error: `No account number column found. Headers detected: ${found}. Expected "account_no".`,
    };
  }

  // ── Data starts at row 2 (index 2)
  const accountNumbers = rows
    .slice(2)
    .map((row) => String(row[colIndex] ?? "").trim())
    .filter(Boolean);

  if (accountNumbers.length === 0) {
    return {
      ok: false,
      error: "The account_no column was found but contains no data.",
    };
  }

  return {
    ok: true,
    accountNumbers,
    totalRows: accountNumbers.length,
  };
}