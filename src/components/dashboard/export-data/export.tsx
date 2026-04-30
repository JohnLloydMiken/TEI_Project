"use client"

import { useState, useEffect } from "react"
import { FileDown, Loader2, CheckCircle2, Clock, XCircle, Users } from "lucide-react"
import { useFetchBatches } from "@/services/useFetchBatches"

type FilterType = "all" | "eligible" | "claimed" | "expired"

const FILTERS: {
  key: FilterType
  label: string
  icon: React.ReactNode
  color: string
}[] = [
  {
    key: "all",
    label: "All Customers",
    icon: <Users className="w-4 h-4" />,
    color: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200",
  },
  {
    key: "eligible",
    label: "Eligible",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-green-50 text-green-700 border-green-300 hover:bg-green-100",
  },
  {
    key: "claimed",
    label: "Claimed / Returned",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100",
  },
  {
    key: "expired",
    label: "Expired",
    icon: <XCircle className="w-4 h-4" />,
    color: "bg-red-50 text-red-700 border-red-300 hover:bg-red-100",
  },
]

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export default function ExportPage() {
  const { batches, isLoading: loadingBatches, error: batchError } = useFetchBatches()

  const [selectedBatch, setSelectedBatch] = useState<number | null>(null)
  const [downloading, setDownloading] = useState<FilterType | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  // Auto-select first batch once batches finish loading
  useEffect(() => {
    if (batches.length > 0 && selectedBatch === null) {
      setSelectedBatch(batches[0].id)
    }
  }, [batches])

  const handleExport = async (filter: FilterType) => {
    if (!selectedBatch) return
    setDownloading(filter)
    setExportError(null)

    try {
      const res = await fetch(`/api/reports/export-data?batchId=${selectedBatch}&filter=${filter}`)

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Export failed.")
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const disposition = res.headers.get("Content-Disposition") ?? ""
      const match = disposition.match(/filename="(.+?)"/)
      a.href = url
      a.download = match?.[1] ?? "export.xlsx"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : "Unexpected error.")
    } finally {
      setDownloading(null)
    }
  }

  const activeBatch = batches.find((b) => b.id === selectedBatch)
  const error = batchError ?? exportError

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Export Data</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a batch and download customer records as an Excel file.
        </p>
      </div>

      {/* Batch Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Select Batch</label>

        {loadingBatches ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading batches…
          </div>
        ) : (
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={selectedBatch ?? ""}
            onChange={(e) => setSelectedBatch(Number(e.target.value))}
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.fileName} — {MONTHS[b.month - 1]} {b.year}
              </option>
            ))}
          </select>
        )}

        {activeBatch && (
          <p className="text-xs text-slate-400">
            Uploaded on{" "}
            {new Date(activeBatch.uploadedAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Export Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Export by Status</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FILTERS.map(({ key, label, icon, color }) => {
            const isLoading = downloading === key
            const isDisabled = !selectedBatch || downloading !== null || loadingBatches

            return (
              <button
                key={key}
                onClick={() => handleExport(key)}
                disabled={isDisabled}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                  ${color}
                `}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {icon}
                    <FileDown className="w-4 h-4" />
                  </>
                )}
                {isLoading ? "Generating…" : `Export ${label}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200
                        rounded-lg px-4 py-3">
          <XCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Note */}
      <p className="text-xs text-slate-400">
        Exported files include: Account No, Customer Name, Address, Email, Phone,
        Deposit Amount, Notification Date, Claimed At, Claimed By, and Status.
      </p>
    </div>
  )
}