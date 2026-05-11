"use client"

import { useEffect, useState } from "react"

interface ReturnedCustomer {
  id: number
  accountNo: string
  customerName: string
  notificationDate: string
  claimedAt: string
  processedBy: string
}

interface UseFetchReturnedCustomersResult {
  customers: ReturnedCustomer[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useFetchReturnedCustomers(): UseFetchReturnedCustomersResult {
  const [customers, setCustomers] = useState<ReturnedCustomer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const fetch_customers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/reports/returned-list")
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to fetch returned customers.")
          return
        }

        setCustomers(json)
      } catch {
        setError("Network error. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetch_customers()
  }, [trigger])

  const refetch = () => setTrigger((t) => t + 1)

  return { customers, isLoading, error, refetch }
}