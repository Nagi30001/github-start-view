"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Repository } from "@/types"
import Header from "@/components/layout/Header"
import RepositorySearch from "@/components/repository/RepositorySearch"
import RepositoryList from "@/components/repository/RepositoryList"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 30

  const fetchStars = async (query = "", pageNum = 1) => {
    if (!session?.accessToken) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pageNum.toString(),
        ...(query && { q: query }),
      })

      const response = await fetch(`/api/stars?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch stars")
      }

      const data = await response.json()
      setRepositories(data.stars || [])
      // 简单计算总页数（实际应该从 API 返回）
      const totalCount = data.stars?.length || 0
      setTotalPages(Math.ceil(totalCount / itemsPerPage) || 1)
    } catch (err) {
      console.error("Error fetching stars:", err)
      setError("加载失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchStars(searchQuery, page)
    }
  }, [status, session, page, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    fetchStars(query, 1)
  }

  const handleUnstar = () => {
    // 重新获取数据
    fetchStars(searchQuery, page)
  }

  const handleRetry = () => {
    fetchStars(searchQuery, page)
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
          <h2 className="text-2xl font-bold mb-2">
            我的 Star 收藏
          </h2>
          <p className="text-gray-600">
            管理您在 GitHub 上收藏的所有项目
          </p>
        </div>

        <div className="mb-6 max-w-2xl">
          <RepositorySearch
            value={searchQuery}
            onChange={handleSearch}
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

        {searchQuery && repositories.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            找到 <span className="font-semibold">{repositories.length}</span> 个匹配的仓库
          </div>
        )}

        <RepositoryList
          repositories={repositories}
          loading={loading}
          onUnstar={handleUnstar}
        />

        {totalPages > 1 && !searchQuery && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(page - 1)}
                      className={loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className={
                          loading
                            ? "pointer-events-none opacity-50"
                            : page === pageNum
                            ? ""
                            : "cursor-pointer hover:underline"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(page + 1)}
                      className={loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  )
}
