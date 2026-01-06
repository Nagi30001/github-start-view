"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface RepositorySearchProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onKeyPress?: (e: React.KeyboardEvent) => void
  disabled?: boolean
}

export default function RepositorySearch({
  value,
  onChange,
  onSearch,
  onKeyPress,
  disabled = false,
}: RepositorySearchProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="搜索仓库名称、描述或语言..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={disabled}
          className="pl-10"
        />
      </div>
      <Button onClick={onSearch} disabled={disabled}>
        <Search className="w-4 h-4 mr-2" />
        搜索
      </Button>
    </div>
  )
}
