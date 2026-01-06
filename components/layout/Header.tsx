"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Star, LogOut, User } from "lucide-react"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <h1 className="text-xl font-bold">GitHub Stars View</h1>
        </div>

        {status === "loading" ? (
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {session.user.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">退出登录</span>
            </Button>
          </div>
        ) : (
          <Button asChild>
            <a href="/api/auth/signin">登录</a>
          </Button>
        )}
      </div>
    </header>
  )
}
