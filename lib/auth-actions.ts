"use server"

// This is a simple mock authentication function
// In a real application, you would use a proper authentication system
export async function authenticateAdmin(email: string, password: string) {
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if the credentials match the admin credentials
  if (email === "ADMIN@LYNQRE.com" && password === "V1531210n!") {
    return {
      success: true,
      message: "Authentication successful",
    }
  }

  return {
    success: false,
    message: "Invalid email or password",
  }
}
