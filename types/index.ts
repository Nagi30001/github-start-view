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
