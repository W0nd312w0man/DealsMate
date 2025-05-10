import { redirect } from "next/navigation"

export default function AdminPage() {
  // In a real application, you would check if the user is authenticated
  // For now, we'll just redirect to the login page
  redirect("/admin/login")
}
