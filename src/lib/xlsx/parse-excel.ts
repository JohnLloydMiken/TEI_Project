/**
 * parse-excel.ts
 * Server-side only. Parses an uploaded Excel buffer using SheetJS.
 *
 * Expects TWO sheets:
 *   Sheet 1 — "Returned"  → customers get status "BD Retained"
 *   Sheet 2 — "Balance"   → customers get status "Pending"
 *
 * Required columns (both sheets, case-insensitive):
 *   account_code | account_no | account_name
 *
 * Optional columns (stored if present, ignored if absent):
 *   deposit_amount | address | email | phone
 */

import * as XLSX from "xlsx";

export type CustomerStatus = "Pending" | "BD Retained";

export interface ParsedCustomerRow {
  accountCode: string;
  accountNo: string;
  customerName: string;
  status: CustomerStatus;
  // Optional — retained for future use
  depositAmount?: number;
  address?: string;
  email?: string;
  phone?: string;
}

export interface ParseResult {
  success: true;
  rows: ParsedCustomerRow[];
  totalRows: number;
  returnedCount: number; // from sheet 1
  balanceCount: number;  // from sheet 2
}

export interface ParseError {
  success: false;
  error: string;
  sheet?: string;
  rowIndex?: number;
}

// ---------------------------------------------------------------------------
// Header normalisation map (lowercase trimmed → internal field key)
// ---------------------------------------------------------------------------
type FieldKey =  keyof Pick <
  ParsedCustomerRow,
  "accountCode" | "accountNo" | "customerName" | "depositAmount" | "address" | "email" | "phone"
>;

const HEADER_MAP: Record<string, FieldKey> = {
  // account_code
  account_code:   "accountCode",
  accountcode:    "accountCode",
  "account code": "accountCode",
  acct_code:      "accountCode",

  // account_no
  account_no:     "accountNo",
  accountno:      "accountNo",
  "account no":   "accountNo",
  "account number":"accountNo",
  accountnumber:  "accountNo",
  acct_no:        "accountNo",

  // account_name / customer name variants
  account_name:   "customerName",
  accountname:    "customerName",
  "account name": "customerName",
  customer_name:  "customerName",
  customername:   "customerName",
  "customer name":"customerName",
  name:           "customerName",

  // optional
  deposit_amount: "depositAmount",
  "deposit amount":"depositAmount",
  depositamount:  "depositAmount",
  deposit:        "depositAmount",
  address:        "address",
  email:          "email",
  "email address":"email",
  phone:          "phone",
  "phone number": "phone",
  phonenumber:    "phone",
};

const REQUIRED_FIELDS: FieldKey[] = ["accountCode", "accountNo", "customerName"];

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function parseCustomerExcel(
  buffer: Buffer | ArrayBuffer,
): ParseResult | ParseError {
  let workbook: XLSX.WorkBook;

  try {
    workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  } catch {
    return {
      success: false,
      error: "Could not read the file. Make sure it is a valid .xlsx or .xls file.",
    };
  }

  if (workbook.SheetNames.length < 2) {
    return {
      success: false,
      error: `Expected 2 sheets ("Returned" and "Balance") but found ${workbook.SheetNames.length}.`,
    };
  }

  // Parse both sheets
  const returnedResult = parseSheet(
    workbook.Sheets[workbook.SheetNames[0]],
    workbook.SheetNames[0],
    "BD Retained",
  );
  if (!returnedResult.success) return returnedResult;

  const balanceResult = parseSheet(
    workbook.Sheets[workbook.SheetNames[1]],
    workbook.SheetNames[1],
    "Pending",
  );
  if (!balanceResult.success) return balanceResult;

  const combined = [...returnedResult.rows, ...balanceResult.rows];

  // Cross-sheet duplicate check (same account_no appearing in both sheets)
  const seen = new Map<string, string>(); // accountNo → sheet name
  for (const row of combined) {
    const key = row.accountNo.toLowerCase();
    if (seen.has(key)) {
      return {
        success: false,
        error: `Account number "${row.accountNo}" appears in both sheets ("${seen.get(key)}" and "${row.status === "Pending" ? workbook.SheetNames[1] : workbook.SheetNames[0]}"). Each customer should appear in only one sheet.`,
      };
    }
    seen.set(key, row.status === "BD Retained" ? workbook.SheetNames[0] : workbook.SheetNames[1]);
  }

  return {
    success: true,
    rows: combined,
    totalRows: combined.length,
    returnedCount: returnedResult.rows.length,
    balanceCount: balanceResult.rows.length,
  };
}

// ---------------------------------------------------------------------------
// Per-sheet parser
// ---------------------------------------------------------------------------
function parseSheet(
  sheet: XLSX.WorkSheet,
  sheetName: string,
  status: CustomerStatus,
): { success: true; rows: ParsedCustomerRow[] } | ParseError {
  if (!sheet) {
    return { success: false, error: `Sheet "${sheetName}" not found.`, sheet: sheetName };
  }

  const rawRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });

  // Find the header row — scan the first 5 rows for one that contains a known field
  let headerRowIndex = -1;
  let fieldIndexMap: Partial<Record<FieldKey, number>> = {};

  for (let i = 0; i < Math.min(5, rawRows.length); i++) {
    const candidate = (rawRows[i] as unknown[]).map((h) =>
      String(h ?? "").toLowerCase().trim().replace(/[\s\u00A0\uFEFF]+/g, " ")
    );
    const tempMap: Partial<Record<FieldKey, number>> = {};
    for (let j = 0; j < candidate.length; j++) {
      const mapped = HEADER_MAP[candidate[j]];
      if (mapped && !(mapped in tempMap)) tempMap[mapped] = j;
    }
    // Accept this row as the header if it maps at least the 3 required fields
    if (REQUIRED_FIELDS.every((f) => f in tempMap)) {
      headerRowIndex = i;
      fieldIndexMap = tempMap;
      break;
    }
  }

  if (headerRowIndex === -1) {
    const friendly: Record<string, string> = {
      accountCode: "account_code",
      accountNo: "account_no",
      customerName: "account_name",
    };
    const missing = REQUIRED_FIELDS.filter((f) => !(f in fieldIndexMap));
    return {
      success: false,
      error: `Sheet "${sheetName}": Could not find required columns: ${missing.map((f) => `"${friendly[f]}"`).join(", ")}. Check your headers.`,
      sheet: sheetName,
    };
  }

  const dataRows = rawRows.slice(headerRowIndex + 1);
  const parsed: ParsedCustomerRow[] = [];
  const seenInSheet = new Set<string>();

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i] as unknown[];
    const excelRowNum = headerRowIndex + i + 2; // 1-based

    const get = (field: FieldKey) =>
      fieldIndexMap[field] != null ? row[fieldIndexMap[field]!] : null;

    // Skip completely blank rows
    if (row.every((cell) => cell == null || String(cell).trim() === "")) continue;

    // --- account_code ---
    const rawCode = get("accountCode");
    const accountCode = rawCode != null ? String(rawCode).trim() : "";
    if (!accountCode) {
      return {
        success: false,
        error: `Sheet "${sheetName}", row ${excelRowNum}: account_code is empty.`,
        sheet: sheetName,
        rowIndex: excelRowNum,
      };
    }

    // --- account_no ---
    const rawNo = get("accountNo");
    const accountNo = rawNo != null ? String(rawNo).trim() : "";
    if (!accountNo) {
      return {
        success: false,
        error: `Sheet "${sheetName}", row ${excelRowNum}: account_no is empty.`,
        sheet: sheetName,
        rowIndex: excelRowNum,
      };
    }

    // --- account_name ---
    const rawName = get("customerName");
    const customerName = rawName != null ? String(rawName).trim() : "";
    if (!customerName) {
      return {
        success: false,
        error: `Sheet "${sheetName}", row ${excelRowNum}: account_name is empty.`,
        sheet: sheetName,
        rowIndex: excelRowNum,
      };
    }

    // --- Intra-sheet duplicate check ---
    const dupeKey = accountNo.toLowerCase();
    if (seenInSheet.has(dupeKey)) {
      return {
        success: false,
        error: `Sheet "${sheetName}", row ${excelRowNum}: Duplicate account_no "${accountNo}" within the same sheet. Fix the file and re-upload.`,
        sheet: sheetName,
        rowIndex: excelRowNum,
      };
    }
    seenInSheet.add(dupeKey);

    // --- Optional fields ---
    const rawDeposit = get("depositAmount");
    const depositRaw = rawDeposit != null ? Number(rawDeposit) : NaN;
    const depositAmount = !isNaN(depositRaw) && depositRaw >= 0 ? depositRaw : undefined;

    const rawAddress = get("address");
    const address = rawAddress != null ? String(rawAddress).trim() || undefined : undefined;

    const rawEmail = get("email");
    const email = rawEmail != null ? String(rawEmail).trim() || undefined : undefined;

    const rawPhone = get("phone");
    const phone = rawPhone != null ? String(rawPhone).trim() || undefined : undefined;

    parsed.push({
      accountCode,
      accountNo,
      customerName,
      status,
      depositAmount,
      address,
      email,
      phone,
    });
  }

  return { success: true, rows: parsed };
}