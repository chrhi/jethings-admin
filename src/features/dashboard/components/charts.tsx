"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts"

// Mock data for charts
const userGrowthData = [
  { month: "Jan", users: 1200, newUsers: 200 },
  { month: "Feb", users: 1350, newUsers: 150 },
  { month: "Mar", users: 1480, newUsers: 130 },
  { month: "Apr", users: 1620, newUsers: 140 },
  { month: "May", users: 1780, newUsers: 160 },
  { month: "Jun", users: 1950, newUsers: 170 },
  { month: "Jul", users: 2100, newUsers: 150 },
  { month: "Aug", users: 2250, newUsers: 150 },
  { month: "Sep", users: 2400, newUsers: 150 },
  { month: "Oct", users: 2350, newUsers: -50 },
]

const roleDistributionData = [
  { name: "Super Admin", value: 2, color: "#ef4444" },
  { name: "Admin", value: 5, color: "#f97316" },
  { name: "Content Manager", value: 8, color: "#eab308" },
  { name: "Viewer", value: 12, color: "#22c55e" },
  { name: "Guest", value: 3, color: "#6b7280" },
]

const activityData = [
  { day: "Mon", logins: 45, actions: 120 },
  { day: "Tue", logins: 52, actions: 135 },
  { day: "Wed", logins: 48, actions: 110 },
  { day: "Thu", logins: 61, actions: 145 },
  { day: "Fri", logins: 55, actions: 130 },
  { day: "Sat", logins: 35, actions: 85 },
  { day: "Sun", logins: 28, actions: 70 },
]

const systemMetricsData = [
  { time: "00:00", cpu: 25, memory: 40, disk: 15 },
  { time: "04:00", cpu: 20, memory: 35, disk: 15 },
  { time: "08:00", cpu: 45, memory: 50, disk: 18 },
  { time: "12:00", cpu: 60, memory: 65, disk: 20 },
  { time: "16:00", cpu: 55, memory: 60, disk: 19 },
  { time: "20:00", cpu: 40, memory: 45, disk: 17 },
]

export function UserGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>
          Monthly user growth and new registrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            users: {
              label: "Total Users",
            },
            newUsers: {
              label: "New Users",
            },
          }}
          className="h-[300px]"
        >
          <AreaChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="newUsers"
              stackId="2"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function RoleDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Distribution</CardTitle>
        <CardDescription>
          Current distribution of user roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={roleDistributionData.reduce((acc, item) => {
            acc[item.name] = { label: item.name }
            return acc
          }, {} as Record<string, { label: string }>)}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={roleDistributionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {roleDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
        <CardDescription>
          Daily logins and user actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            logins: {
              label: "Logins",
            },
            actions: {
              label: "Actions",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="logins" fill="#8884d8" />
            <Bar dataKey="actions" fill="#82ca9d" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function SystemMetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>
          Real-time system performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cpu: {
              label: "CPU Usage (%)",
            },
            memory: {
              label: "Memory Usage (%)",
            },
            disk: {
              label: "Disk Usage (%)",
            },
          }}
          className="h-[300px]"
        >
          <LineChart data={systemMetricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444" }}
            />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316" }}
            />
            <Line
              type="monotone"
              dataKey="disk"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e" }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
