"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Repository } from "@/types"
import Header from "@/components/layout/Header"
import RepositorySearch from "@/components/repository/RepositorySearch"
import RepositoryList from "@/components/repository/RepositoryList"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { githubService } from "@/lib/github"

type ViewMode = "grid3" | "grid5" | "list"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [allRepositories, setAllRepositories] = useState<Repository[]>([])
  const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid3")

  const fetchStars = async () => {
    if (!session?.accessToken) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/stars")

      if (!response.ok) {
        throw new Error("Failed to fetch stars")
      }

      const data = await response.json()
      setAllRepositories(data.stars || [])
      setFilteredRepositories(data.stars || [])
    } catch (err) {
      console.error("Error fetching stars:", err)
      setError("加载失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchStars()
    }
  }, [status, session])

  const handleSearch = () => {
    const query = searchInput.trim()
    setSearchQuery(query)

    if (!query) {
      setFilteredRepositories(allRepositories)
    } else {
      const filtered = githubService.searchLocalStars(allRepositories, query)
      setFilteredRepositories(filtered)
    }
  }

  const handleRetry = () => {
    fetchStars()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin")
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                我的 Star 收藏
              </h2>
              <p className="text-gray-600">
                共 {allRepositories.length} 个项目
              </p>
            </div>

            {/* 视图模式切换 */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid3" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid3")}
              >
                3列
              </Button>
              <Button
                variant={viewMode === "grid5" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid5")}
              >
                5列
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                列表
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6 max-w-2xl">
          <RepositorySearch
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={loading}
            >
              重试
            </Button>
          </div>
        )}

        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600">
            找到 <span className="font-semibold">{filteredRepositories.length}</span> 个匹配的仓库
          </div>
        )}

        <RepositoryList
          repositories={filteredRepositories}
          loading={loading}
          viewMode={viewMode}
        />
      </div>
    </main>
  )
}
