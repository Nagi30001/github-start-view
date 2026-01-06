"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface RepositorySearchProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function RepositorySearch({
  value,
  onChange,
  disabled = false,
}: RepositorySearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="搜索仓库名称、描述或语言..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-10"
      />
    </div>
  )
}
