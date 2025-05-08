import bcrypt from "bcryptjs"

/**
 * This is a utility script to generate a bcrypt hash for a password
 * Run this with ts-node or similar to generate a hash for a new password
 *
 * Example: npx ts-node scripts/generate-password-hash.ts
 */
async function generateHash() {
  const password = "V1531210n!!" // Replace with the password you want to hash
  const salt = await bcrypt.genSalt(12)
  const hash = await bcrypt.hash(password, salt)

  console.log("Password:", password)
  console.log("Bcrypt Hash:", hash)
}

generateHash().catch(console.error)
