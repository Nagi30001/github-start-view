import { Repository } from "@/types"

export class GitHubService {
  private apiVersion = process.env.GITHUB_API_VERSION || "2022-11-28"

  private getHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": this.apiVersion,
    }
  }

  async getStars(
    accessToken: string,
    page: number = 1,
    perPage: number = 100
  ): Promise<Repository[]> {
    // 获取所有 star 的仓库（不分页，获取全部）
    let allStars: Repository[] = []
    let currentPage = 1
    let hasMore = true

    while (hasMore) {
      const response = await fetch(
        `https://api.github.com/user/starred?page=${currentPage}&per_page=${perPage}`,
        {
          headers: this.getHeaders(accessToken),
          next: { revalidate: 60 } // Cache for 60 seconds
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch stars: ${response.statusText}`)
      }

      const data = await response.json()

      // GitHub API 返回的数据格式检查
      // 对于 starred 仓库，API 返回的 data 包含仓库信息和 starred_at 时间
      const processedData = data.map((item: any) => {
        // 确保我们使用正确的 updated_at 字段
        // item.repo 是完整的仓库信息，item.starred_at 是我们 star 的时间
        const repo = item.repo || item
        return {
          ...repo,
          starred_at: item.starred_at || repo.pushed_at || repo.updated_at,
          // 优先使用 pushed_at（最后推送时间），其次是 updated_at
          updated_at: repo.pushed_at || repo.updated_at
        }
      })

      allStars = [...allStars, ...processedData]

      // 如果返回的数据少于 perPage，说明已经到最后一页
      hasMore = data.length === perPage
      currentPage++
    }

    return allStars
  }

  async unstarRepo(
    accessToken: string,
    owner: string,
    repo: string
  ): Promise<void> {
    const response = await fetch(
      `https://api.github.com/user/starred/${owner}/${repo}`,
      {
        method: "DELETE",
        headers: this.getHeaders(accessToken),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to unstar: ${response.statusText}`)
    }
  }

  // 本地搜索功能 - 在前端使用，不需要调用 API
  searchLocalStars(stars: Repository[], query: string): Repository[] {
    if (!query) {
      return stars
    }

    const lowerQuery = query.toLowerCase()
    return stars.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowerQuery) ||
        (repo.description && repo.description.toLowerCase().includes(lowerQuery)) ||
        repo.language?.toLowerCase().includes(lowerQuery) ||
        repo.full_name.toLowerCase().includes(lowerQuery)
    )
  }

  getRepoLanguageColor(language: string): string {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      Go: "#00ADD8",
      Rust: "#dea584",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
      Vue: "#41b883",
      React: "#61dafb",
      default: "#8b949e",
    }
    return colors[language] || colors.default
  }

  formatUpdatedAt(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "今天"
    if (days === 1) return "昨天"
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    if (days < 365) return `${Math.floor(days / 30)}月前`
    return `${Math.floor(days / 365)}年前`
  }
}

export const githubService = new GitHubService()
