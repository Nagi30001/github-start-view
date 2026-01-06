import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { githubService } from "@/lib/github"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 获取所有 star 数据（不分页）
    const stars = await githubService.getStars(session.accessToken)

    return NextResponse.json({ stars })
  } catch (error) {
    console.error("Error fetching stars:", error)
    return NextResponse.json(
      { error: "Failed to fetch stars" },
      { status: 500 }
    )
  }
}
