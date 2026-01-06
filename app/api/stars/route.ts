import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { githubService } from "@/lib/github"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const query = searchParams.get("q") || ""

    let stars
    if (query) {
      stars = await githubService.searchStars(session.accessToken, query, page)
    } else {
      stars = await githubService.getStars(session.accessToken, page)
    }

    return NextResponse.json({ stars })
  } catch (error) {
    console.error("Error fetching stars:", error)
    return NextResponse.json(
      { error: "Failed to fetch stars" },
      { status: 500 }
    )
  }
}
