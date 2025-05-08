"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState("An unknown error occurred")

  useEffect(() => {
    const error = searchParams.get("error")

    if (error) {
      switch (error) {
        case "AccessDenied":
          setErrorMessage("You do not have permission to access this resource")
          break
        case "AuthenticationRequired":
          setErrorMessage("You must be signed in to access this page")
          break
        default:
          setErrorMessage(`Error: ${error}`)
      }
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Error</h1>

        <p className="text-gray-600 dark:text-gray-400">{errorMessage}</p>

        <div className="pt-4 space-y-4">
          <Button onClick={() => router.back()} variant="outline" className="w-full">
            Go Back
          </Button>

          <Button onClick={() => router.push("/login")} className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
