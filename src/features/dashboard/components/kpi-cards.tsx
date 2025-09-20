"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  UserCog, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Shield,
  Eye,
  AlertTriangle
} from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ReactNode
  description?: string
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

function KPICard({ title, value, change, icon, description, badge }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change && (
          <div className="flex items-center mt-2">
            {change.type === 'increase' ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-xs ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {change.value}% from last month
            </span>
          </div>
        )}
        {badge && (
          <div className="mt-2">
            <Badge variant={badge.variant} className="text-xs">
              {badge.text}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Users"
        value="2,350"
        change={{ value: 12.5, type: 'increase' }}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Active users in the system"
        badge={{ text: "Active", variant: "default" }}
      />
      
      <KPICard
        title="Admin Roles"
        value="8"
        change={{ value: 2.1, type: 'increase' }}
        icon={<UserCog className="h-4 w-4 text-muted-foreground" />}
        description="Different role types"
        badge={{ text: "Configured", variant: "secondary" }}
      />
      
      <KPICard
        title="System Health"
        value="99.9%"
        change={{ value: 0.1, type: 'increase' }}
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        description="Uptime this month"
        badge={{ text: "Excellent", variant: "default" }}
      />
      
      <KPICard
        title="Security Score"
        value="A+"
        icon={<Shield className="h-4 w-4 text-muted-foreground" />}
        description="Overall security rating"
        badge={{ text: "Secure", variant: "default" }}
      />
      
      <KPICard
        title="Page Views"
        value="45,231"
        change={{ value: 8.2, type: 'increase' }}
        icon={<Eye className="h-4 w-4 text-muted-foreground" />}
        description="This month"
        badge={{ text: "Growing", variant: "secondary" }}
      />
      
      <KPICard
        title="Alerts"
        value="3"
        icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        description="Pending notifications"
        badge={{ text: "Low", variant: "outline" }}
      />
    </div>
  )
}
