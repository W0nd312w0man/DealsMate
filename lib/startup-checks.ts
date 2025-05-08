import { validateEnvVars, generateEnvVarDocs } from "./env"

/**
 * Performs startup checks to ensure the application is properly configured
 */
export function performStartupChecks() {
  console.log("🔍 Performing application startup checks...")

  // Check environment variables
  const envResults = validateEnvVars()

  if (!envResults.valid) {
    console.error("❌ Environment variable validation failed!")
    console.error(`Missing required variables: ${envResults.missing.join(", ")}`)
    console.error("\nPlease set the following environment variables:")

    envResults.missing.forEach((key) => {
      console.error(`- ${key}`)
    })

    // In development, provide more detailed help
    if (process.env.NODE_ENV === "development") {
      console.error("\n" + generateEnvVarDocs())
    }
  } else {
    console.log("✅ Environment variables validation passed!")

    if (envResults.usingFallbacks.length > 0) {
      console.warn("⚠️ Using fallback values for some environment variables:")
      envResults.usingFallbacks.forEach((key) => {
        console.warn(`- ${key}`)
      })
      console.warn("Consider setting these variables explicitly for production.")
    }
  }

  // Add more startup checks here as needed
  // e.g., database connectivity, external service availability, etc.

  console.log("🚀 Startup checks completed!")
}
