import type { Metadata } from "next"
import Image from "next/image"
import LoginForm from "@/components/admin/login-form"

export const metadata: Metadata = {
  title: "Admin Login | DealsMate",
  description: "Admin login for DealsMate Transaction Management System",
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src="/purple-lavender-dm.png" width={80} height={80} alt="DealsMate Logo" className="mb-2" />
          <h1 className="font-poppins text-3xl font-bold tracking-tight text-exp-purple dark:text-exp-lavender">
            DealsMate
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Access Portal</p>
        </div>

        <div className="mt-8 rounded-lg border bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Secure access for authorized administrators only
        </p>
      </div>
    </div>
  )
}
