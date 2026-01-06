"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo, useCallback } from "react"
import { Repository, ViewMode, SortField, SortOrder } from "@/types"
import Header from "@/components/layout/Header"
import RepositorySearch from "@/components/repository/RepositorySearch"
import RepositoryList from "@/components/repository/RepositoryList"
import SortButton from "@/components/repository/SortButton"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { githubService } from "@/lib/github"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [allRepositories, setAllRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid3")
  const [sortField, setSortField] = useState<SortField>("updated_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const fetchStars = useCallback(async () => {
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
      setHasLoadedOnce(true)
    } catch (err) {
      console.error("Error fetching stars:", err)
      setError("加载失败，请重试")
    } finally {
      setLoading(false)
    }
  }, [session?.accessToken])

  useEffect(() => {
    // 只在认证成功后加载一次
    if (status === "authenticated" && session?.accessToken && !hasLoadedOnce) {
      fetchStars()
    }
  }, [status, session, hasLoadedOnce, fetchStars])

  // 使用 useMemo 优化排序和过滤逻辑
  const filteredRepositories = useMemo(() => {
    let sorted = [...allRepositories]

    // 排序
    sorted.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "stars":
          comparison = a.stargazers_count - b.stargazers_count
          break
        case "updated_at":
          // 使用 pushed_at（如果存在），否则使用 updated_at
          const aUpdatedAt = a.pushed_at || a.updated_at
          const bUpdatedAt = b.pushed_at || b.updated_at
          comparison = new Date(aUpdatedAt).getTime() - new Date(bUpdatedAt).getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    // 搜索过滤
    if (searchQuery) {
      sorted = githubService.searchLocalStars(sorted, searchQuery)
    }

    return sorted
  }, [allRepositories, sortField, sortOrder, searchQuery])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 切换排序顺序
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // 切换到新字段，默认降序
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const handleRefresh = () => {
    fetchStars()
  }

  const handleSearch = () => {
    const query = searchInput.trim()
    setSearchQuery(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getSortLabel = (field: SortField): string => {
    switch (field) {
      case "stars":
        return "星标数"
      case "starred_at":
        return "星标时间"
      case "updated_at":
        return "更新时间"
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

            {/* 排序和视图模式切换 */}
            <div className="flex gap-2 items-center">
              {/* 排序按钮组 */}
              <div className="flex gap-1 border-r pr-2 mr-2">
                <SortButton
                  field="stars"
                  label="星标数"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onClick={() => handleSort("stars")}
                />
                <SortButton
                  field="updated_at"
                  label="更新时间"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onClick={() => handleSort("updated_at")}
                />
              </div>

              {/* 刷新按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="mr-2"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                刷新
              </Button>

              {/* 视图模式切换 */}
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
              onClick={handleRefresh}
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

        {/* 首次加载显示全屏加载动画 */}
        {loading && !hasLoadedOnce && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4" />
            <p className="text-gray-600 text-lg">正在加载您的星标仓库...</p>
            <p className="text-gray-400 text-sm mt-2">这可能需要几秒钟</p>
          </div>
        )}

        {/* 非首次加载或加载完成显示列表 */}
        {(!loading || hasLoadedOnce) && (
          <RepositoryList
            repositories={filteredRepositories}
            loading={loading && hasLoadedOnce}
            viewMode={viewMode}
          />
        )}
      </div>
    </main>
  )
}
