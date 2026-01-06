"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"

export default function AuthErrorPage() {
  useEffect(() => {
    // 3秒后自动重新跳转到登录页
    const timer = setTimeout(() => {
      signIn("github", { callbackUrl: "/" })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900">认证出错</h1>
        <p className="text-gray-600">
          登录过程中出现问题，请稍后重试。
        </p>
        <p className="text-sm text-gray-500">
          将在 3 秒后自动重新跳转到登录页面...
        </p>
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          立即重新登录
        </button>
      </div>
    </div>
  )
}
