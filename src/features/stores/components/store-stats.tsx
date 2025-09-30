"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreStats } from "../types"
import { 
  Store, 
  TrendingUp, 
  Users, 
  Euro,
  CheckCircle,
  Clock,
  XCircle,
  Pause
} from "lucide-react"

interface StoreStatsProps {
  stats: StoreStats | null
  loading?: boolean
}

export function StoreStatsComponent({ stats, loading = false }: StoreStatsProps) {
  if (loading || !stats) {
    return (
      <div className="space-y-6">
        {/* Store Status Cards Skeleton */}
        <div>
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    )
  }

  const statCards = [
    {
      title: "Total des magasins",
      value: stats.total,
      icon: Store,
      description: "Tous les magasins",
      color: "text-blue-600"
    },
    {
      title: "Magasins actifs",
      value: stats.active,
      icon: CheckCircle,
      description: "Approuvés et opérationnels",
      color: "text-green-600"
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: Clock,
      description: "En cours de validation",
      color: "text-yellow-600"
    },
    {
      title: "Rejetés",
      value: stats.rejected,
      icon: XCircle,
      description: "Non approuvés",
      color: "text-red-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Store Status Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Statut des magasins</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

    </div>
  )
}
