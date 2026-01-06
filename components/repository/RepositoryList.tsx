"use client"

import { Repository } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import RepositoryCard from "./RepositoryCard"

type ViewMode = "grid3" | "grid5" | "list"

interface RepositoryListProps {
  repositories: Repository[]
  loading?: boolean
  viewMode?: ViewMode
}

export default function RepositoryList({
  repositories,
  loading = false,
  viewMode = "grid3",
}: RepositoryListProps) {
  const getGridClass = () => {
    switch (viewMode) {
      case "grid3":
        return "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      case "grid5":
        return "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      case "list":
        return "flex flex-col gap-3"
      default:
        return "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    }
  }

  if (loading) {
    return (
      <div className={getGridClass()}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">
          没有找到匹配的仓库
        </p>
        <p className="text-gray-400 text-sm">
          请尝试其他搜索关键词
        </p>
      </div>
    )
  }

  return (
    <div className={getGridClass()}>
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} viewMode={viewMode} />
      ))}
    </div>
  )
}
