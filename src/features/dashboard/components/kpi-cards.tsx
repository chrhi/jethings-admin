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
  AlertTriangle,
  Store
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

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
  chartData?: Array<{ name: string; value: number }>
  chartType?: 'line' | 'area' | 'bar'
  chartColor?: string
}

function KPICard({ title, value, change, icon, description, badge, chartData, chartType = 'line', chartColor = '#3b82f6' }: KPICardProps) {
  const renderChart = () => {
    if (!chartData || chartData.length === 0) return null;

    const chartProps = {
      data: chartData,
      width: '100%',
      height: 60,
    };

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={chartData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fill={chartColor}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={chartData}>
              <Bar dataKey="value" fill={chartColor} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

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
        {chartData && (
          <div className="mt-3">
            {renderChart()}
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

  const userGrowthData = [
    { name: 'Jan', value: 1800 },
    { name: 'Feb', value: 1950 },
    { name: 'Mar', value: 2100 },
    { name: 'Apr', value: 2200 },
    { name: 'May', value: 2300 },
    { name: 'Jun', value: 2350 },
  ];

  const storeGrowthData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 98 },
    { name: 'Mar', value: 115 },
    { name: 'Apr', value: 128 },
    { name: 'May', value: 138 },
    { name: 'Jun', value: 145 },
  ];

  

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="User Growth"
        value="2,350"
        change={{ value: 12.5, type: 'increase' }}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Active users in the system"
        badge={{ text: "Growing", variant: "default" }}
        chartData={userGrowthData}
        chartType="area"
        chartColor="#10b981"
      />
      
      <KPICard
        title="Store Growth"
        value="145"
        change={{ value: 18.3, type: 'increase' }}
        icon={<Store className="h-4 w-4 text-muted-foreground" />}
        description="Total registered stores"
        badge={{ text: "Expanding", variant: "default" }}
        chartData={storeGrowthData}
        chartType="line"
        chartColor="#3b82f6"
      />
      
     
    </div>
  )
}