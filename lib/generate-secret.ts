import crypto from "crypto"

/**
 * Generates a secure random string suitable for use as a secret key
 *
 * @param length The length of the string to generate (default: 32)
 * @returns A secure random string
 */
export function generateSecureSecret(length = 32): string {
  return crypto.randomBytes(length).toString("base64").slice(0, length)
}

// If this file is executed directly (e.g., with `node generate-secret.js`),
// output a new secret to the console
if (require.main === module) {
  const secret = generateSecureSecret()
  console.log("\nGenerated Secret:")
  console.log("------------------")
  console.log(secret)
  console.log("\nAdd this to your .env file:")
  console.log("AUTH_SECRET=" + secret)
  console.log("")
}
