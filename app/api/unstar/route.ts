import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { githubService } from "@/lib/github"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { owner, repo } = body

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      )
    }

    await githubService.unstarRepo(session.accessToken, owner, repo)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unstarring:", error)
    return NextResponse.json(
      { error: "Failed to unstar repository" },
      { status: 500 }
    )
  }
}
