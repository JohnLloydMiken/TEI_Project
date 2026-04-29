// src/lib/parseExcelDate.ts
import * as XLSX from "xlsx";

/**
 * Converts an Excel serial date number (e.g. 46100) to a JavaScript Date.
 * Excel's epoch starts on 1900-01-01 (with a leap year bug on day 60).
 * SheetJS handles this correctly via XLSX.SSF.parse_date_code.
 *
 * Returns null if the value is not a valid serial number.
 */
export function parseExcelDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  if (isNaN(num) || num < 1) return null;

  // SheetJS built-in: converts serial → { y, m, d, H, M, S }
  const parsed = XLSX.SSF.parse_date_code(num);
  if (!parsed) return null;

  // Construct as UTC midnight to avoid timezone shifts when storing
  return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
}