"use client"

import { Repository } from "@/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  GitFork,
  ExternalLink,
  Clock,
} from "lucide-react"
import { githubService } from "@/lib/github"
import { useMemo } from "react"

type ViewMode = "grid3" | "grid5" | "list"

interface RepositoryCardProps {
  repository: Repository
  viewMode?: ViewMode
}

export default function RepositoryCard({
  repository,
  viewMode = "grid3",
}: RepositoryCardProps) {
  // 使用 useMemo 缓存计算结果
  const languageColor = useMemo(
    () => githubService.getRepoLanguageColor(repository.language || ""),
    [repository.language]
  )

  const updatedAt = useMemo(
    () => githubService.formatUpdatedAt(repository.updated_at),
    [repository.updated_at]
  )

  // 紧凑视图（5列模式）
  if (viewMode === "grid5") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 p-3 flex flex-col h-full">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarImage
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <AvatarFallback className="text-xs">
                {repository.owner.login.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-sm truncate flex items-center gap-1 flex-1">
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {repository.name}
              </a>
              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </h3>
          </div>

          {repository.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-1">
              {repository.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs mt-auto">
          {repository.language && (
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: languageColor }}
              />
              <span className="text-gray-700">{repository.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-gray-600">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{repository.stargazers_count}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <GitFork className="w-3 h-3" />
            <span>{repository.forks_count}</span>
          </div>
        </div>
      </Card>
    )
  }

  // 列表视图
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <AvatarFallback>
                {repository.owner.login.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate flex items-center gap-2">
                <a
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repository.full_name}
                </a>
                <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
              </h3>
              {repository.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {repository.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm flex-shrink-0">
              {repository.language && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: languageColor }}
                  />
                  <span className="text-gray-700">{repository.language}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{repository.stargazers_count}</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-600">
                <GitFork className="w-4 h-4" />
                <span>{repository.forks_count}</span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{updatedAt}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 默认网格视图（3列模式）
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader className="pb-3 flex-1">
        <div className="flex items-start gap-3 min-h-0">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <AvatarFallback>
              {repository.owner.login.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate flex items-center gap-2">
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {repository.full_name}
              </a>
              <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </h3>
            {repository.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {repository.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {repository.language && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: languageColor }}
              />
              <span className="text-gray-700">{repository.language}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{repository.stargazers_count}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600">
            <GitFork className="w-4 h-4" />
            <span>{repository.forks_count}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{updatedAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
