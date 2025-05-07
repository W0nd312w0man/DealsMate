"use client"

import { useState, useEffect } from "react"

// Email view preference types
export type EmailViewPreference = "popup-modal" | "expanded-inline" | "bottom-right-panel"

// Default preference
const DEFAULT_EMAIL_VIEW_PREFERENCE: EmailViewPreference = "popup-modal"

export function useEmailViewPreferences() {
  const [emailViewPreference, setEmailViewPreference] = useState<EmailViewPreference>(DEFAULT_EMAIL_VIEW_PREFERENCE)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load preference from localStorage
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem("emailViewPreference")
      if (savedPreference) {
        setEmailViewPreference(savedPreference as EmailViewPreference)
      }
    } catch (error) {
      console.error("Failed to load email view preference", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Update email view preference
  const updateEmailViewPreference = (preference: EmailViewPreference) => {
    setEmailViewPreference(preference)
    localStorage.setItem("emailViewPreference", preference)
  }

  return {
    emailViewPreference,
    updateEmailViewPreference,
    isLoaded,
  }
}
