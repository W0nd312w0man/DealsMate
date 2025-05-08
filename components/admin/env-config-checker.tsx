"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { REQUIRED_ENV_VARS, type EnvVarKey } from "@/lib/env"

export function EnvConfigChecker() {
  const [configValid, setConfigValid] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [missingVars, setMissingVars] = useState<EnvVarKey[]>([])

  useEffect(() => {
    // In a real app, this would call an API endpoint that checks the server environment
    // For this demo, we'll simulate the check
    const checkConfig = async () => {
      try {
        // Simulate API call to check environment variables
        const response = await fetch("/api/admin/check-env")
        const data = await response.json()

        setConfigValid(data.valid)
        setMissingVars(data.missing || [])
      } catch (error) {
        console.error("Failed to check environment configuration:", error)
        setConfigValid(false)
        setMissingVars(["AUTH_SECRET"]) // Assume AUTH_SECRET is missing for demo
      }
    }

    checkConfig()
  }, [])

  if (configValid) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTitle>Environment Configuration Error</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          The application is missing required environment variables. This may cause functionality issues or security
          vulnerabilities.
        </p>

        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="mb-2">
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>

        {showDetails && (
          <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-sm">
            <p className="font-semibold mb-1">Missing environment variables:</p>
            <ul className="list-disc pl-5 space-y-1">
              {missingVars.map((varName) => (
                <li key={varName}>
                  <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1 py-0.5 rounded">{varName}</code>
                  {REQUIRED_ENV_VARS[varName] && (
                    <span className="block text-xs mt-0.5 ml-1">{REQUIRED_ENV_VARS[varName].description}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs">Please contact your system administrator to resolve this issue.</p>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
