// src/components/batch/ExcelDropzone.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import {
  FileSpreadsheet,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { parseAccountExcel } from "@/lib//xlsx/parseAccountExcel";

interface ExcelDropzoneProps {
  onAccountsReady: (accountNumbers: string[]) => void;
  onClear: () => void;
  loading: boolean;
}

export default function ExcelDropzone({
  onAccountsReady,
  onClear,
  loading,
}: ExcelDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedCount, setParsedCount] = useState<number | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const dropped = acceptedFiles[0];
      if (!dropped) return;

      // Reset state for new file
      setFile(dropped);
      setParseError(null);
      setParsedCount(null);
      setIsParsing(true);

      const result = await parseAccountExcel(dropped);

      setIsParsing(false);

      if (!result.ok) {
        setParseError(result.error);
        return;
      }

      setParsedCount(result.totalRows);
      onAccountsReady(result.accountNumbers);
    },
    [onAccountsReady]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    disabled: loading || isParsing,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setParseError(null);
    setParsedCount(null);
    onClear();
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl px-6 py-14 text-center
          transition-colors duration-200
          ${loading || isParsing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            isDragActive
              ? "border-teiorange bg-orange-50"
              : "border-gray-200 hover:border-teiorange hover:bg-orange-50/30"
          }
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isParsing ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <div className="w-6 h-6 border-2 border-teiorange border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Reading your file…</p>
            </motion.div>
          ) : isDragActive ? (
            <motion.div
              key="drag"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-teiorange"
            >
              <UploadCloud className="w-9 h-9" />
              <p className="text-sm font-semibold">Release to upload</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <FileSpreadsheet className="w-10 h-10 text-gray-300" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  Drag & drop an Excel file, or{" "}
                  <span className="text-teiorange font-semibold">
                    browse files
                  </span>
                </p>
                <p className="text-xs text-gray-300">
                  .xlsx or .xls · Must contain an{" "}
                  <span className="font-semibold">Account No</span> or{" "}
                  <span className="font-semibold">Account Number</span> column
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success pill */}
      <AnimatePresence>
        {file && parsedCount !== null && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-green-50 border border-green-200"
          >
            <div className="flex items-center gap-2 text-green-700 min-w-0">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium truncate">{file.name}</span>
              <span className="text-xs text-green-500 font-semibold shrink-0">
                · {parsedCount} account{parsedCount !== 1 ? "s" : ""} found
              </span>
            </div>
            <button
              onClick={handleClear}
              className="ml-3 text-green-400 hover:text-red-400 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parse error */}
      <AnimatePresence>
        {parseError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-500">
                Could not read file
              </p>
              <p className="text-xs text-red-400 mt-0.5">{parseError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}