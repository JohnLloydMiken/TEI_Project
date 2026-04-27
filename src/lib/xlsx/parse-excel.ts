/**
 * excelParser.ts
 * Server-side only. Parses an uploaded Excel buffer using SheetJS.
 * Validates required columns, coerces types, and returns structured rows.
 *
 * Expected columns (case-insensitive, order-independent):
 *   Account No | Customer Name | Address | Email | Phone | Deposit Amount | Notification Date
 */

import * as XLSX from "xlsx";

export interface ParsedCustomerRow {
  accountNo: string;
  customerName: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  depositAmount: number;
  notificationDate: Date;
}

export interface ParseResult {
  success: true;
  rows: ParsedCustomerRow[];
  totalRows: number;
}

export interface ParseError {
  success: false;
  error: string;
  rowIndex?: number; // 1-based (matches Excel row numbers for human readability)
}

// Canonical header map: lowercase trimmed → field key
const HEADER_MAP: Record<string, keyof ParsedCustomerRow> = {
  "account no": "accountNo",
  "account number": "accountNo",
  "account_no": "accountNo",
  accountno: "accountNo",
  accountnumber: "accountNo",
  "customer name": "customerName",
  "customer_name": "customerName",
  customername: "customerName",
  name: "customerName",
  address: "address",
  email: "email",
  "email address": "email",
  phone: "phone",
  "phone number": "phone",
  phonenumber: "phone",
  "deposit amount": "depositAmount",
  "deposit_amount": "depositAmount",
  depositamount: "depositAmount",
  deposit: "depositAmount",
  "notification date": "notificationDate",
  "notification_date": "notificationDate",
  notificationdate: "notificationDate",
  "notif date": "notificationDate",
  notifdate: "notificationDate",
};

const REQUIRED_FIELDS: Array<keyof ParsedCustomerRow> = [
  "accountNo",
  "customerName",
  "depositAmount",
  "notificationDate",
];

export function parseCustomerExcel(
  buffer: Buffer | ArrayBuffer
): ParseResult | ParseError {
  let workbook: XLSX.WorkBook;

  try {
    workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  } catch {
    return { success: false, error: "Could not read the file. Make sure it is a valid .xlsx or .xls file." };
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { success: false, error: "The workbook has no sheets." };
  }

  const sheet = workbook.Sheets[sheetName];
  // header: 1 → returns array of arrays (first row = headers)
  const rawRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  if (rawRows.length < 2) {
    return { success: false, error: "The file has no data rows (only a header or is completely empty)." };
  }

  // --- Map header row ---
  const headerRow = (rawRows[0] as unknown[]).map((h) =>
    String(h ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
  );

  const fieldIndexMap: Partial<Record<keyof ParsedCustomerRow, number>> = {};
  for (let i = 0; i < headerRow.length; i++) {
    const mapped = HEADER_MAP[headerRow[i]];
    if (mapped && !(mapped in fieldIndexMap)) {
      fieldIndexMap[mapped] = i;
    }
  }

  // Validate required columns are present
  for (const field of REQUIRED_FIELDS) {
    if (!(field in fieldIndexMap)) {
      const friendly: Record<string, string> = {
        accountNo: "Account No",
        customerName: "Customer Name",
        depositAmount: "Deposit Amount",
        notificationDate: "Notification Date",
      };
      return {
        success: false,
        error: `Missing required column: "${friendly[field]}". Check your Excel headers.`,
      };
    }
  }

  const dataRows = rawRows.slice(1);
  const parsed: ParsedCustomerRow[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i] as unknown[];
    const excelRowNum = i + 2; // +1 for header, +1 for 1-based

    const get = (field: keyof ParsedCustomerRow) => row[fieldIndexMap[field]!];

    // Account No
    const rawAccount = get("accountNo");
    const accountNo = rawAccount != null ? String(rawAccount).trim() : "";
    if (!accountNo) {
      return {
        success: false,
        error: `Row ${excelRowNum}: Account No is empty.`,
        rowIndex: excelRowNum,
      };
    }

    // Customer Name
    const rawName = get("customerName");
    const customerName = rawName != null ? String(rawName).trim() : "";
    if (!customerName) {
      return {
        success: false,
        error: `Row ${excelRowNum}: Customer Name is empty.`,
        rowIndex: excelRowNum,
      };
    }

    // Deposit Amount
    const rawDeposit = get("depositAmount");
    const depositAmount = Number(rawDeposit);
    if (rawDeposit == null || isNaN(depositAmount) || depositAmount < 0) {
      return {
        success: false,
        error: `Row ${excelRowNum}: Invalid Deposit Amount "${rawDeposit}". Must be a non-negative number.`,
        rowIndex: excelRowNum,
      };
    }

    // Notification Date — SheetJS with cellDates:true returns JS Date objects
    const rawDate = get("notificationDate");
    let notificationDate: Date;
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      notificationDate = rawDate;
    } else if (typeof rawDate === "number") {
      // Excel serial date fallback
      const parsed = XLSX.SSF.parse_date_code(rawDate);
      notificationDate = new Date(parsed.y, parsed.m - 1, parsed.d);
    } else if (typeof rawDate === "string" && rawDate.trim()) {
      const attempt = new Date(rawDate.trim());
      if (isNaN(attempt.getTime())) {
        return {
          success: false,
          error: `Row ${excelRowNum}: Cannot parse Notification Date "${rawDate}". Use a recognizable date format.`,
          rowIndex: excelRowNum,
        };
      }
      notificationDate = attempt;
    } else {
      return {
        success: false,
        error: `Row ${excelRowNum}: Notification Date is missing or unreadable.`,
        rowIndex: excelRowNum,
      };
    }

    // Optional fields
    const rawAddress = get("address");
    const address = rawAddress != null ? String(rawAddress).trim() || null : null;

    const rawEmail = get("email");
    const email = rawEmail != null ? String(rawEmail).trim() || null : null;

    const rawPhone = get("phone");
    const phone = rawPhone != null ? String(rawPhone).trim() || null : null;

    parsed.push({
      accountNo,
      customerName,
      address,
      email,
      phone,
      depositAmount,
      notificationDate,
    });
  }

  // --- Intra-file duplicate check ---
  const seen = new Set<string>();
  for (let i = 0; i < parsed.length; i++) {
    const key = parsed[i].accountNo;
    if (seen.has(key)) {
      return {
        success: false,
        error: `Duplicate account number "${key}" found within the file (row ${i + 2}). Fix the file and re-upload. Upload aborted.`,
        rowIndex: i + 2,
      };
    }
    seen.add(key);
  }

  return { success: true, rows: parsed, totalRows: parsed.length };
}