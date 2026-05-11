"use client"

import { useEffect, useState } from "react"

interface CSDUser {
  id: number
  name: string
  email: string
  createdAt: string
  password: string
  claimsProcessed: number
}

interface UseFetchCSDUsersResult {
  users: CSDUser[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useFetchCSDUsers(): UseFetchCSDUsersResult {
  const [users, setUsers] = useState<CSDUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/admin/manage-csd/display")
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? "Failed to fetch users.")
          return
        }

        setUsers(json)
      } catch {
        setError("Network error. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [trigger])

  const refetch = () => setTrigger((t) => t + 1)

  return { users, isLoading, error, refetch }
}