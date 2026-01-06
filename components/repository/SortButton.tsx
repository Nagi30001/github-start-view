"use client"

import { Button } from "@/components/ui/button"
import { SortField, SortOrder } from "@/types"

interface SortButtonProps {
  field: SortField
  label: string
  currentField: SortField
  currentOrder: SortOrder
  onClick: () => void
}

export default function SortButton({
  field,
  label,
  currentField,
  currentOrder,
  onClick,
}: SortButtonProps) {
  const isActive = currentField === field
  const orderIcon = isActive ? (currentOrder === "asc" ? "↑" : "↓") : null

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="min-w-[100px]"
    >
      {label}
      {orderIcon && <span className="ml-1 text-xs">{orderIcon}</span>}
    </Button>
  )
}
