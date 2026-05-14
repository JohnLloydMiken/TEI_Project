/**
 * Client-side parser for the checker Excel.
 * Single flat sheet — only account_no is required.
 * account_code and customer_name are treated as optional
 * since the authoritative data comes from the DB masterlist.
 */
import * as XLSX from "xlsx";

export type CheckerRow = {
  accountNo: string;
};

export type CheckerParseResult =
  | { success: true; rows: CheckerRow[]; total: number }
  | { success: false; error: string };

const ACCOUNT_NO_KEYS = new Set([
  "account_no",
  "accountno",
  "account no",
  "account number",
  "accountnumber",
  "acct_no",
]);

export function parseCheckerExcel(buffer: ArrayBuffer): CheckerParseResult {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(buffer, { type: "array" });
  } catch {
    return { success: false, error: "Could not read the file. Make sure it is a valid .xlsx or .xls file." };
  }

  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) return { success: false, error: "The file appears to be empty." };

  const rawRows: unknown[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
  });

  // Find header row (scan first 5 rows)
  let headerRowIndex = -1;
  let accountNoColIndex = -1;

  for (let i = 0; i < Math.min(5, rawRows.length); i++) {
    const candidate = (rawRows[i] as unknown[]).map((h) =>
      String(h ?? "").toLowerCase().trim().replace(/[\s\u00A0]+/g, " "),
    );
    const idx = candidate.findIndex((h) => ACCOUNT_NO_KEYS.has(h));
    if (idx !== -1) {
      headerRowIndex = i;
      accountNoColIndex = idx;
      break;
    }
  }

  if (headerRowIndex === -1) {
    return {
      success: false,
      error: 'Could not find an "account_no" column. Check your headers.',
    };
  }

  const dataRows = rawRows.slice(headerRowIndex + 1);
  const rows: CheckerRow[] = [];

  for (const row of dataRows as unknown[][]) {
    if (row.every((c) => c == null || String(c).trim() === "")) continue;
    const raw = row[accountNoColIndex];
    const accountNo = raw != null ? String(raw).trim() : "";
    if (!accountNo) continue; // skip rows where account_no cell is blank
    rows.push({ accountNo });
  }

  if (rows.length === 0) {
    return { success: false, error: "No account numbers found in the file." };
  }

  return { success: true, rows, total: rows.length };
}