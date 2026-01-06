"use client"

import { Repository } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import RepositoryCard from "./RepositoryCard"

interface RepositoryListProps {
  repositories: Repository[]
  loading?: boolean
  onUnstar?: () => void
}

export default function RepositoryList({
  repositories,
  loading = false,
  onUnstar,
}: RepositoryListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
        <p className="text-gray-500 text-lg mb-4">还没有收藏任何仓库</p>
        <p className="text-gray-400 text-sm">
          去 GitHub 上收藏一些您喜欢的项目吧！
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} onUnstar={onUnstar} />
      ))}
    </div>
  )
}
