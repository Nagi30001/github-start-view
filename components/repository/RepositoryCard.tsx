"use client"

import { Repository } from "@/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  GitFork,
  ExternalLink,
  Star as StarOff,
  Clock,
  AlertCircle,
} from "lucide-react"
import { githubService } from "@/lib/github"
import { useState } from "react"
import { useSession } from "next-auth/react"

interface RepositoryCardProps {
  repository: Repository
  onUnstar?: () => void
}

export default function RepositoryCard({
  repository,
  onUnstar,
}: RepositoryCardProps) {
  const { data: session } = useSession()
  const [isUnstarring, setIsUnstarring] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleUnstar = async () => {
    if (!session?.accessToken) return

    try {
      setIsUnstarring(true)
      setIsError(false)

      await githubService.unstarRepo(
        session.accessToken,
        repository.owner.login,
        repository.name
      )

      if (onUnstar) {
        onUnstar()
      }
    } catch (error) {
      console.error("Failed to unstar:", error)
      setIsError(true)
      setTimeout(() => setIsError(false), 3000)
    } finally {
      setIsUnstarring(false)
    }
  }

  const languageColor = githubService.getRepoLanguageColor(
    repository.language || ""
  )
  const updatedAt = githubService.formatUpdatedAt(repository.updated_at)

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
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
        </div>
      </CardHeader>

      <CardContent>
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

          {isError && (
            <div className="flex items-center gap-1.5 text-red-500 ml-auto">
              <AlertCircle className="w-4 h-4" />
              <span>操作失败</span>
            </div>
          )}

          {!isError && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleUnstar}
              disabled={isUnstarring}
              className="ml-auto gap-2"
            >
              <StarOff className="w-4 h-4" />
              {isUnstarring ? "取消中..." : "取消 Star"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
