import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    image: string
    login: string
  }
}

export type SortField = "stars" | "updated_at"
export type SortOrder = "asc" | "desc"
export type ViewMode = "grid3" | "grid5" | "list"

export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  owner: {
    login: string
    avatar_url: string
  }
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
  topics: string[]
  size: number
  starred_at?: string // 用户 star 这个仓库的时间
  pushed_at?: string // 仓库最后推送时间
}

export interface SearchQuery {
  q?: string
  language?: string
  page?: number
  per_page?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  hasMore: boolean
}
