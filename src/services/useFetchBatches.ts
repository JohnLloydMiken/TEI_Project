"use client"

import { useEffect, useState } from "react"

interface Batch {
  id: number
  fileName: string
  month: number
  year: number
  uploadedAt: string
}

interface UseFetchBatchesResult {
  batches: Batch[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useFetchBatches(): UseFetchBatchesResult {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const fetch_batches = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/reports/export-data/upload-batch")
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to fetch batches.")
          return
        }

        setBatches(json)
      } catch {
        setError("Network error. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetch_batches()
  }, [trigger])

  const refetch = () => setTrigger((t) => t + 1)

  return { batches, isLoading, error, refetch }
}