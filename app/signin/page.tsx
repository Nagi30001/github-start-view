"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"

export default function SignInPage() {
  useEffect(() => {
    signIn("github", { callbackUrl: "/" })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
        <p className="text-gray-600">正在跳转到 GitHub 登录...</p>
      </div>
    </div>
  )
}
