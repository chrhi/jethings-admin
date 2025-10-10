"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductTypeStats } from "../types"

interface ProductTypeStatsProps {
  stats?: ProductTypeStats
  loading?: boolean
}

export function ProductTypeStatsComponent({ stats, loading }: ProductTypeStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Product Types",
      value: stats.total,
      description: "All product types in the system"
    },
    {
      title: "Active Types",
      value: stats.active,
      description: "Currently active product types"
    },
    {
      title: "Inactive Types", 
      value: stats.inactive,
      description: "Deactivated product types"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="rounded-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
