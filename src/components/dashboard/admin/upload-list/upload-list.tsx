"use client";

/**
 * /app/admin/upload/page.tsx
 */

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Upload, AlertCircle, CheckCircle2, X, RotateCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewRow {
  accountCode: string;
  accountNo: string;
  customerName: string;
  status: "Pending" | "BD Retained";
  depositAmount?: string;
}

type UploadStage = "idle" | "preview" | "uploading" | "success" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const COLUMN_FORMAT = [
  { col: "account_code", type: "Text",   required: true  },
  { col: "account_no",   type: "Text",   required: true  },
  { col: "account_name", type: "Text",   required: true  },
  { col: "deposit_amount", type: "Number", required: false },
  { col: "address",      type: "Text",   required: false },
  { col: "email",        type: "Text",   required: false },
  { col: "phone",        type: "Text",   required: false },
];

// ─── Header normalisation (mirrors server-side parser) ────────────────────────

type FieldKey = "accountCode" | "accountNo" | "customerName" | "depositAmount";

const HEADER_MAP: Record<string, FieldKey> = {
  account_code:    "accountCode",
  accountcode:     "accountCode",
  "account code":  "accountCode",
  acct_code:       "accountCode",

  account_no:      "accountNo",
  accountno:       "accountNo",
  "account no":    "accountNo",
  "account number":"accountNo",
  accountnumber:   "accountNo",
  acct_no:         "accountNo",

  account_name:    "customerName",
  accountname:     "customerName",
  "account name":  "customerName",
  customer_name:   "customerName",
  customername:    "customerName",
  "customer name": "customerName",
  name:            "customerName",

  deposit_amount:   "depositAmount",
  "deposit amount": "depositAmount",
  depositamount:    "depositAmount",
  deposit:          "depositAmount",
};

const REQUIRED_FIELDS: FieldKey[] = ["accountCode", "accountNo", "customerName"];

// ─── Client-side preview parser (two-sheet aware) ─────────────────────────────

function parsePreviewFromBuffer(
  buffer: ArrayBuffer,
): PreviewRow[] | string {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(buffer, { type: "array", cellDates: true });
  } catch {
    return "Could not read the file. Make sure it is a valid .xlsx or .xls file.";
  }

  if (wb.SheetNames.length < 2) {
    return `Expected 2 sheets ("Returned" and "Balance") but found ${wb.SheetNames.length}.`;
  }

  const returnedRows = parseSheetPreview(
    wb.Sheets[wb.SheetNames[0]],
    wb.SheetNames[0],
    "BD Retained",
  );
  if (typeof returnedRows === "string") return returnedRows;

  const balanceRows = parseSheetPreview(
    wb.Sheets[wb.SheetNames[1]],
    wb.SheetNames[1],
    "Pending",
  );
  if (typeof balanceRows === "string") return balanceRows;

  return [...returnedRows, ...balanceRows];
}

function parseSheetPreview(
  sheet: XLSX.WorkSheet,
  sheetName: string,
  status: "Pending" | "BD Retained",
): PreviewRow[] | string {
  if (!sheet) return `Sheet "${sheetName}" not found.`;

  const rawRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });

  // Find header row by scanning first 5 rows
  let headerRowIndex = -1;
  let fieldIndexMap: Partial<Record<FieldKey, number>> = {};

  for (let i = 0; i < Math.min(5, rawRows.length); i++) {
    const candidate = (rawRows[i] as unknown[]).map((h) =>
      String(h ?? "").toLowerCase().trim().replace(/[\s\u00A0]+/g, " ")
    );
    const tempMap: Partial<Record<FieldKey, number>> = {};
    for (let j = 0; j < candidate.length; j++) {
      const mapped = HEADER_MAP[candidate[j]];
      if (mapped && !(mapped in tempMap)) tempMap[mapped] = j;
    }
    if (REQUIRED_FIELDS.every((f) => f in tempMap)) {
      headerRowIndex = i;
      fieldIndexMap = tempMap;
      break;
    }
  }

  if (headerRowIndex === -1) {
    return `Sheet "${sheetName}": Could not find required columns (account_code, account_no, account_name). Check your headers.`;
  }

  const dataRows = rawRows.slice(headerRowIndex + 1) as unknown[][];
  const rows: PreviewRow[] = [];

  for (const row of dataRows) {
    // Skip blank rows
    if ((row as unknown[]).every((c) => c == null || String(c).trim() === "")) continue;

    const get = (f: FieldKey) =>
      fieldIndexMap[f] != null ? (row as unknown[])[fieldIndexMap[f]!] : null;

    const rawDeposit = get("depositAmount");
    const depositNum = rawDeposit != null ? Number(rawDeposit) : NaN;

    rows.push({
      accountCode:  String(get("accountCode") ?? "").trim(),
      accountNo:    String(get("accountNo") ?? "").trim(),
      customerName: String(get("customerName") ?? "").trim(),
      status,
      depositAmount:
        !isNaN(depositNum) && depositNum >= 0
          ? depositNum.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
          : undefined,
    });
  }

  return rows;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AdminUploadPage() {
  const [stage, setStage]             = useState<UploadStage>("idle");
  const [file, setFile]               = useState<File | null>(null);
  const [preview, setPreview]         = useState<PreviewRow[]>([]);
  const [parseError, setParseError]   = useState<string | null>(null);
  const [month, setMonth]             = useState<number>(new Date().getMonth() + 1);
  const [year, setYear]               = useState<number>(currentYear);
  const [apiError, setApiError]       = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    message: string;
    totalInserted: number;
    returnedCount: number;
    balanceCount: number;
    replaced: boolean;
    batchId: number;
  } | null>(null);

  // ── Dropzone ────────────────────────────────────────────────────────────────

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setParseError(null);
    setApiError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const buf = e.target?.result as ArrayBuffer;
      const result = parsePreviewFromBuffer(buf);
      if (typeof result === "string") {
        setParseError(result);
        setStage("idle");
        setFile(null);
      } else {
        setPreview(result);
        setStage("preview");
      }
    };
    reader.readAsArrayBuffer(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: stage === "uploading",
  });

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleUpload() {
    if (!file) return;
    setStage("uploading");
    setApiError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", String(month));
    formData.append("year", String(year));
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error ?? "Upload failed. Please try again.");
        setStage("error");
      } else {
        setSuccessData(data);
        setStage("success");
      }
    } catch {
      setApiError("Network error. Check your connection and try again.");
      setStage("error");
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function reset() {
    setStage("idle");
    setFile(null);
    setPreview([]);
    setParseError(null);
    setApiError(null);
    setSuccessData(null);
    setMonth(new Date().getMonth() + 1);
    setYear(currentYear);
  }

  const batchLabel = `${MONTHS[month - 1]} ${year}`;

  // Derived counts from preview (for the split badge while in preview stage)
  const previewReturnedCount = preview.filter((r) => r.status === "BD Retained").length;
  const previewBalanceCount  = preview.filter((r) => r.status === "Pending").length;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-7 space-y-5" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ════════════════════════════════════════════
          SUCCESS CARD
      ════════════════════════════════════════════ */}
      {stage === "success" && successData && (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="px-5 py-3" style={{ backgroundColor: "#1e2d4f" }}>
            <h3 className="text-white font-semibold text-sm">Upload Complete</h3>
          </div>
          <div className="p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-sm">{successData.message}</p>
              <div className="grid grid-cols-5 gap-3">
                {([
                  ["Batch ID",        `#${successData.batchId}`],
                  ["Total Imported",  String(successData.totalInserted)],
                  ["BD Retained",     String(successData.returnedCount)],
                  ["Pending",         String(successData.balanceCount)],
                  ["Action",          successData.replaced ? "Replaced" : "Created"],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="rounded border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Upload Another Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          CARD 1 — Upload Excel File
      ════════════════════════════════════════════ */}
      {stage !== "success" && (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">

          <div className="px-5 py-3" style={{ backgroundColor: "#1e2d4f" }}>
            <h3 className="text-white font-semibold text-sm">Upload Excel File</h3>
          </div>

          <div className="p-5 space-y-4">

            {/* Batch month row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Specify Batch Month:</span>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                disabled={stage === "uploading"}
                className="border border-gray-300 rounded px-2.5 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={stage === "uploading"}
                className="border border-gray-300 rounded px-2.5 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span
                className="px-3 py-1 rounded text-sm font-medium text-white"
                style={{ backgroundColor: "#1e2d4f" }}
              >
                {batchLabel}
              </span>
            </div>

            {/* Dropzone + buttons */}
            <div className="flex items-start gap-3">
              <div
                {...getRootProps()}
                className="flex-1 border-2 border-dashed rounded cursor-pointer transition-all min-h-[88px] flex flex-col items-start justify-center gap-1 px-4 py-4 select-none"
                style={{
                  borderColor: isDragActive ? "#e8692a" : stage === "preview" ? "#86efac" : "#d1d5db",
                  backgroundColor: isDragActive ? "#fff8f4" : stage === "preview" ? "#f0fdf4" : "#ffffff",
                }}
              >
                <input {...getInputProps()} />
                {stage === "preview" && file ? (
                  <>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">
                      {preview.length} rows parsed ({previewReturnedCount} BD Retained,{" "}
                      {previewBalanceCount} Pending) — drop a new file to replace
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Upload className="w-4 h-4 shrink-0" />
                      <span className="text-sm text-gray-500">
                        {isDragActive ? "Drop here…" : "Drag & drop a .xlsx file (must have Returned and Balance sheets)"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">Sheet 1: Returned → BD Retained · Sheet 2: Balance → Pending</p>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleUpload}
                  disabled={stage !== "preview" || !file}
                  className="px-5 py-2 rounded border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 whitespace-nowrap"
                  style={{ borderColor: "#9ca3af", color: "#374151", backgroundColor: "white" }}
                >
                  {stage === "uploading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Uploading…
                    </span>
                  ) : (
                    "Confirm Upload"
                  )}
                </button>
                <button
                  onClick={reset}
                  disabled={stage === "uploading"}
                  className="px-5 py-2 rounded text-sm font-semibold transition-opacity disabled:opacity-40 whitespace-nowrap"
                  style={{ backgroundColor: "#1e2d4f", color: "#e8692a" }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Parse error */}
            {parseError && (
              <div className="flex items-start gap-2.5 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{parseError}</span>
                <button onClick={() => setParseError(null)}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* API error */}
            {apiError && (
              <div className="flex items-start gap-2.5 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{apiError}</span>
                <button onClick={() => { setApiError(null); setStage(file ? "preview" : "idle"); }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Overwrite warning */}
            {stage === "preview" && (
              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Uploading will permanently replace any existing batch for{" "}
                <strong>{batchLabel}</strong>.
              </p>
            )}
          </div>

          {/* Preview table */}
          {stage === "preview" && preview.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Preview — {preview.length} rows
                </span>
                <span className="text-xs text-gray-400">Showing first 8</span>
              </div>
              <div className="overflow-x-auto max-h-56 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Account Code", "Account No", "Account Name", "Status", "Deposit"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-2.5 text-left text-xs text-gray-400 font-medium whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {preview.slice(0, 8).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-2.5 font-mono text-xs text-gray-500 whitespace-nowrap">
                          {row.accountCode || <span className="text-gray-300">—</span>}
                        </td>
                        <td
                          className="px-5 py-2.5 font-medium whitespace-nowrap"
                          style={{ color: "#e8692a" }}
                        >
                          {row.accountNo || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-2.5 text-gray-700 whitespace-nowrap">
                          {row.customerName || "—"}
                        </td>
                        <td className="px-5 py-2.5 whitespace-nowrap">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={
                              row.status === "BD Retained"
                                ? { backgroundColor: "#dcfce7", color: "#166534" }
                                : { backgroundColor: "#fef9c3", color: "#854d0e" }
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-gray-500 whitespace-nowrap">
                          {row.depositAmount ?? "—"}
                        </td>
                      </tr>
                    ))}
                    {preview.length > 8 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-2.5 text-center text-xs text-gray-400">
                          + {preview.length - 8} more rows not shown
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          CARD 2 — Expected Column Format
      ════════════════════════════════════════════ */}
      {stage !== "success" && (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <div className="px-5 py-3" style={{ backgroundColor: "#1e2d4f" }}>
            <h3 className="text-white font-semibold text-sm">Expected Column Format</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Column", "Type", "Required"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {COLUMN_FORMAT.map(({ col, type, required }) => (
                <tr key={col} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-sm text-gray-700">{col}</td>
                  <td className="px-5 py-3 text-gray-500">{type}</td>
                  <td className="px-5 py-3">
                    {required ? (
                      <span className="font-semibold" style={{ color: "#e8692a" }}>Yes</span>
                    ) : (
                      <span className="text-gray-400">Optional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}