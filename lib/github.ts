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
    perPage: number = 30
  ): Promise<Repository[]> {
    const response = await fetch(
      `https://api.github.com/user/starred?page=${page}&per_page=${perPage}`,
      {
        headers: this.getHeaders(accessToken),
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch stars: ${response.statusText}`)
    }

    return response.json()
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

  async searchStars(
    accessToken: string,
    query: string,
    page: number = 1
  ): Promise<Repository[]> {
    // 获取所有 stars（GitHub API 不支持直接搜索用户 starred 的仓库）
    const allStars = await this.getStars(accessToken, 1, 100)

    if (!query) {
      return allStars
    }

    const lowerQuery = query.toLowerCase()
    return allStars.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowerQuery) ||
        (repo.description && repo.description.toLowerCase().includes(lowerQuery)) ||
        repo.language?.toLowerCase().includes(lowerQuery)
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
