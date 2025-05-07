import { redirect } from "next/navigation"

export default function Home() {
  // Redirect from the root path to the landing page
  redirect("/landing")
}
