"use client";

/**
 * /app/admin/upload/page.tsx
 *
 * Content-only upload page — sidebar and topbar are rendered by the
 * parent layout (app/admin/layout.tsx), so this file contains only
 * the two cards visible in the mockup:
 *   1. Upload Excel File
 *   2. Expected Column Format
 */

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Upload, AlertCircle, CheckCircle2, X, RotateCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewRow {
  accountNo: string;
  customerName: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  depositAmount: string;
  notificationDate: string;
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
  { col: "account_no",        type: "Text",   required: true  },
  { col: "customer_name",     type: "Text",   required: true  },
  { col: "notification_date", type: "Date",   required: true  },
  { col: "deposit_amount",    type: "Number", required: true  },
  { col: "address",           type: "Text",   required: false },
  { col: "email",             type: "Text",   required: false },
  { col: "phone",             type: "Text",   required: false },
];

// ─── Client-side Excel preview parser ────────────────────────────────────────

function parsePreviewFromBuffer(buffer: ArrayBuffer): PreviewRow[] | string {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(buffer, { type: "array", cellDates: true });
  } catch {
    return "Could not read the file. Make sure it is a valid .xlsx or .xls file.";
  }

  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1, defval: null, blankrows: false,
  });
  if (rows.length < 2) return "File is empty or has no data rows.";

  const headerRow = (rows[0] as unknown[]).map((h) =>
    String(h ?? "").toLowerCase().trim().replace(/\s+/g, " ")
  );

  const idx = (candidates: string[]) => {
    for (const c of candidates) {
      const i = headerRow.indexOf(c);
      if (i !== -1) return i;
    }
    return -1;
  };

  const colMap = {
    accountNo:        idx(["account no","account number","accountno","account_no"]),
    customerName:     idx(["customer name","customername","customer_name","name"]),
    address:          idx(["address"]),
    email:            idx(["email","email address","email_address"]),
    phone:            idx(["phone","phone number","phone_number"]),
    depositAmount:    idx(["deposit amount","depositamount","deposit_amount","deposit"]),
    notificationDate: idx(["notification date","notificationdate","notification_date","notif date"]),
  };

  const requiredKeys: Array<keyof typeof colMap> = [
    "accountNo","customerName","depositAmount","notificationDate",
  ];
  const requiredLabels: Record<string, string> = {
    accountNo: "account_no", customerName: "customer_name",
    depositAmount: "deposit_amount", notificationDate: "notification_date",
  };
  for (const key of requiredKeys) {
    if (colMap[key] === -1)
      return `Missing required column: "${requiredLabels[key]}". Check your Excel headers.`;
  }

  const dataRows = rows.slice(1) as unknown[][];
  return dataRows.map((row) => {
    const get = (i: number) => (i !== -1 ? row[i] : null);
    const rawDate = get(colMap.notificationDate);
    let dateStr = "";
    if (rawDate instanceof Date) {
      dateStr = rawDate.toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
      });
    } else if (rawDate != null) {
      dateStr = String(rawDate);
    }
    return {
      accountNo:        String(get(colMap.accountNo) ?? "").trim(),
      customerName:     String(get(colMap.customerName) ?? "").trim(),
      address:          get(colMap.address) != null ? String(get(colMap.address)).trim() || null : null,
      email:            get(colMap.email) != null ? String(get(colMap.email)).trim() || null : null,
      phone:            get(colMap.phone) != null ? String(get(colMap.phone)).trim() || null : null,
      depositAmount:    get(colMap.depositAmount) != null
        ? Number(get(colMap.depositAmount)).toLocaleString("en-PH", {
            style: "currency", currency: "PHP",
          })
        : "—",
      notificationDate: dateStr || "—",
    };
  });
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
    message: string; totalInserted: number; replaced: boolean; batchId: number;
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
              <div className="grid grid-cols-4 gap-3">
                {([
                  ["Batch ID",          `#${successData.batchId}`],
                  ["Records Imported",  String(successData.totalInserted)],
                  ["Action",            successData.replaced ? "Replaced" : "Created"],
                  ["Period",            batchLabel],
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

          {/* Card header */}
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
              {/* Pill — mimics the "April 2025" badge in the mockup */}
              <span
                className="px-3 py-1 rounded text-sm font-medium text-white"
                style={{ backgroundColor: "#1e2d4f" }}
              >
                {batchLabel}
              </span>
            </div>

            {/* Dropzone + buttons row */}
            <div className="flex items-start gap-3">

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className="flex-1 border-2 border-dashed rounded cursor-pointer transition-all min-h-[88px] flex flex-col items-start justify-center gap-1 px-4 py-4 select-none"
                style={{
                  borderColor: isDragActive
                    ? "#e8692a"
                    : stage === "preview"
                    ? "#86efac"
                    : "#d1d5db",
                  backgroundColor: isDragActive
                    ? "#fff8f4"
                    : stage === "preview"
                    ? "#f0fdf4"
                    : "#ffffff",
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
                      {preview.length} rows parsed — drop a new file to replace
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Upload className="w-4 h-4 shrink-0" />
                      <span className="text-sm text-gray-500">
                        {isDragActive ? "Drop here…" : "Or drag & drop a .csv / .xlsx file"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-6">One account number per row</p>
                  </>
                )}
              </div>

              {/* Buttons — stacked, match mockup */}
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
                <button
                  onClick={() => {
                    setApiError(null);
                    setStage(file ? "preview" : "idle");
                  }}
                >
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

          {/* Preview table — inside card, below controls */}
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
                      {["Account No", "Customer Name", "Deposit", "Notif. Date", "Email"].map((h) => (
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
                        <td
                          className="px-5 py-2.5 font-medium whitespace-nowrap"
                          style={{ color: "#e8692a" }}
                        >
                          {row.accountNo || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-2.5 text-gray-700 whitespace-nowrap">
                          {row.customerName || "—"}
                        </td>
                        <td className="px-5 py-2.5 text-gray-500 whitespace-nowrap">
                          {row.depositAmount}
                        </td>
                        <td className="px-5 py-2.5 text-gray-500 whitespace-nowrap">
                          {row.notificationDate}
                        </td>
                        <td className="px-5 py-2.5 text-gray-400 whitespace-nowrap">
                          {row.email || "—"}
                        </td>
                      </tr>
                    ))}
                    {preview.length > 8 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-2.5 text-center text-xs text-gray-400"
                        >
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
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs text-gray-400 font-medium"
                  >
                    {h}
                  </th>
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
                      <span className="font-semibold" style={{ color: "#e8692a" }}>
                        Yes
                      </span>
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