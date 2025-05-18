"use client"

// Remove all API calls from auth actions
export async function authenticateAdmin(email: string, password: string) {
  // Return mock success without making API calls
  return { success: true, message: "Authentication successful" }
}

export async function signOut() {
  // Return mock success without making API calls
  return { success: true }
}

export async function signUp(formData: FormData) {
  // Return mock success without making API calls
  return { success: true }
}
