"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserStats } from "../types"
import { Users, UserCheck, Mail, Shield } from "lucide-react"

interface UserStatsProps {
  stats: UserStats | null
  loading: boolean
}

export function UserStatsComponent({ stats, loading }: UserStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: UserCheck,
      description: "Currently active users",
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers.toLocaleString(),
      icon: Mail,
      description: "Email verified users",
    },
    {
      title: "Admins",
      value: (stats.usersByRole.admin || 0 + stats.usersByRole.super_admin || 0).toString(),
      icon: Shield,
      description: "Admin users",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function RoleDistributionStats({ stats }: { stats: UserStats | null }) {
  if (!stats) return null

  const totalUsers = stats.totalUsers
  const roleData = Object.entries(stats.usersByRole).map(([role, count]) => ({
    role: role.replace('_', ' '),
    count,
    percentage: totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : '0',
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roleData.map(({ role, count, percentage }) => (
            <div key={role} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{role}</span>
                <span className="font-medium">{count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
