"use client"

import { useState } from "react"

interface CreateUserPayload {
  fullName: string
  email: string
  password: string
}

interface CreateUserResult {
  isLoading: boolean
  error: string | null
  success: boolean
  handleCreateUser: (data: CreateUserPayload) => Promise<void>
}

export function useCreateNewUser(): CreateUserResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleCreateUser = async (data: CreateUserPayload) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/admin/manage-csd/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? "Something went wrong.")
        return
      }

      setSuccess(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, success, handleCreateUser }
}