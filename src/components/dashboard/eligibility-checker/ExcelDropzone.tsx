"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, X, FileSpreadsheet, AlertCircle } from "lucide-react";
import { parseCheckerExcel } from "@/lib/xlsx/parseAccountExcel";

interface ExcelDropzoneProps {
  onReady: (accountNos: string[]) => void;
  onClear: () => void;
  loading: boolean;
}

export default function ExcelDropzone({ onReady, onClear, loading }: ExcelDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);

  const processFile = useCallback(
    (f: File) => {
      setParseError(null);
      setRowCount(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = parseCheckerExcel(e.target!.result as ArrayBuffer);
        if (!result.success) {
          setParseError(result.error);
          setFile(null);
          return;
        }
        setRowCount(result.total);
        onReady(result.rows.map((r) => r.accountNo));
      };
      reader.readAsArrayBuffer(f);
    },
    [onReady],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const f = accepted[0];
      if (!f) return;
      setFile(f);
      processFile(f);
    },
    [processFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
    disabled: loading,
  });

  const handleClear = () => {
    setFile(null);
    setParseError(null);
    setRowCount(null);
    onClear();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl px-6 py-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
          ${isDragActive ? "border-teiorange bg-orange-50" : file ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-teiorange/60 bg-gray-50"}
          ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <UploadCloud
          className={`w-8 h-8 transition-colors ${file ? "text-green-400" : "text-gray-300"}`}
        />
        {file ? (
          <p className="text-sm text-green-600 font-medium text-center">
            {file.name}
            {rowCount !== null && (
              <span className="ml-2 text-green-400 font-normal">({rowCount} accounts)</span>
            )}
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-400 text-center">
              {isDragActive
                ? "Drop your file here…"
                : "Drag & drop an Excel file, or click to browse"}
            </p>
            <p className="text-xs text-gray-300">
              .xlsx / .xls · Single sheet · Required column: account_no
            </p>
          </>
        )}
      </div>

      {/* File pill + clear */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 w-fit"
          >
            <FileSpreadsheet size={14} className="text-green-500 shrink-0" />
            <span className="truncate max-w-[220px]">{file.name}</span>
            <button
              onClick={handleClear}
              className="text-gray-300 hover:text-red-400 transition-colors ml-1"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parse error */}
      <AnimatePresence>
        {parseError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-xs text-red-500 font-medium"
          >
            <AlertCircle size={13} className="shrink-0" />
            {parseError}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}