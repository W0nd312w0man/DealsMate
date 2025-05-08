/**
 * Environment Variables Management System
 *
 * This module provides utilities for validating and accessing environment variables
 * with proper error handling and fallbacks.
 */

// Define the required environment variables and their descriptions
export const REQUIRED_ENV_VARS = {
  // Authentication
  AUTH_SECRET: {
    description: "Secret key used for authentication token encryption",
    example: "a-random-string-at-least-32-characters-long",
    fallback: process.env.NODE_ENV === "development" ? "dev-fallback-secret-do-not-use-in-production" : null,
  },

  // API URLs
  API_URL: {
    description: "Base URL for API requests",
    example: "https://api.example.com",
    fallback: process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : null,
  },

  // Database
  DATABASE_URL: {
    description: "Connection string for the database",
    example: "postgresql://user:password@localhost:5432/dbname",
    fallback: null, // No fallback for database URL
  },
}

// Type for environment variable keys
export type EnvVarKey = keyof typeof REQUIRED_ENV_VARS

/**
 * Gets an environment variable with proper error handling
 *
 * @param key The environment variable key
 * @param required Whether the variable is required
 * @returns The environment variable value or fallback
 * @throws Error if the variable is required and not set
 */
export function getEnvVar(key: EnvVarKey, required = true): string {
  const value = process.env[key] || REQUIRED_ENV_VARS[key].fallback

  if (required && !value) {
    // In development, provide a helpful error message
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
          `Description: ${REQUIRED_ENV_VARS[key].description}\n` +
          `Example: ${REQUIRED_ENV_VARS[key].example}\n` +
          `Please add this variable to your .env file or environment.`,
      )
    }

    // In production, log the error but don't expose details
    console.error(`Missing required environment variable: ${key}`)
    throw new Error("Application configuration error. Please contact the administrator.")
  }

  return value || ""
}

/**
 * Validates all required environment variables
 *
 * @returns An object with validation results
 */
export function validateEnvVars() {
  const results = {
    valid: true,
    missing: [] as EnvVarKey[],
    usingFallbacks: [] as EnvVarKey[],
  }

  for (const key of Object.keys(REQUIRED_ENV_VARS) as EnvVarKey[]) {
    const value = process.env[key]
    const fallback = REQUIRED_ENV_VARS[key].fallback

    if (!value) {
      if (fallback) {
        results.usingFallbacks.push(key)
      } else {
        results.missing.push(key)
        results.valid = false
      }
    }
  }

  return results
}

/**
 * Generates environment variable documentation
 *
 * @returns A string with documentation for all required environment variables
 */
export function generateEnvVarDocs(): string {
  let docs = "# Required Environment Variables\n\n"

  for (const [key, info] of Object.entries(REQUIRED_ENV_VARS)) {
    docs += `## ${key}\n`
    docs += `${info.description}\n\n`
    docs += `Example: \`${info.example}\`\n\n`

    if (info.fallback && process.env.NODE_ENV === "development") {
      docs += `Fallback in development: \`${info.fallback}\`\n\n`
    } else {
      docs += `No fallback available. This variable is required.\n\n`
    }
  }

  return docs
}

/**
 * Checks if the application is properly configured
 *
 * @returns True if all required environment variables are set
 */
export function isAppConfigured(): boolean {
  try {
    const results = validateEnvVars()
    return results.valid
  } catch (error) {
    return false
  }
}
