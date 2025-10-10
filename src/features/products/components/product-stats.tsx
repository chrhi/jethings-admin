"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductStats } from "../types"

interface ProductStatsProps {
  stats?: ProductStats
  loading?: boolean
}

export function ProductStatsComponent({ stats, loading }: ProductStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
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
      title: "Total Products",
      value: stats.total,
      description: "All products in catalog"
    },
    {
      title: "Active",
      value: stats.active,
      description: "Currently available"
    },
    {
      title: "Inactive", 
      value: stats.inactive,
      description: "Not available"
    },
    {
      title: "Featured",
      value: stats.featured,
      description: "Promoted products"
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      description: "No inventory"
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      description: "≤10 items remaining"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
