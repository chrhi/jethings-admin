"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  UserPlus, 
  UserMinus, 
  Shield, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

interface ActivityItem {
  id: string
  type: 'user_created' | 'user_deleted' | 'role_updated' | 'settings_changed' | 'alert' | 'success'
  user: string
  action: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    type: "user_created",
    user: "John Doe",
    action: "created a new user account",
    timestamp: "2 minutes ago",
    status: "completed"
  },
  {
    id: "2",
    type: "role_updated",
    user: "Admin User",
    action: "updated role permissions",
    timestamp: "15 minutes ago",
    status: "completed"
  },
  {
    id: "3",
    type: "settings_changed",
    user: "System Admin",
    action: "modified system settings",
    timestamp: "1 hour ago",
    status: "completed"
  },
  {
    id: "4",
    type: "alert",
    user: "System",
    action: "security alert triggered",
    timestamp: "2 hours ago",
    status: "pending"
  },
  {
    id: "5",
    type: "user_deleted",
    user: "Jane Smith",
    action: "deleted user account",
    timestamp: "3 hours ago",
    status: "completed"
  },
  {
    id: "6",
    type: "success",
    user: "System",
    action: "backup completed successfully",
    timestamp: "4 hours ago",
    status: "completed"
  }
]

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'user_created':
      return <UserPlus className="h-4 w-4 text-green-600" />
    case 'user_deleted':
      return <UserMinus className="h-4 w-4 text-red-600" />
    case 'role_updated':
      return <Shield className="h-4 w-4 text-blue-600" />
    case 'settings_changed':
      return <Settings className="h-4 w-4 text-orange-600" />
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: ActivityItem['status']) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="text-xs">Completed</Badge>
    case 'pending':
      return <Badge variant="secondary" className="text-xs">Pending</Badge>
    case 'failed':
      return <Badge variant="destructive" className="text-xs">Failed</Badge>
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest system activities and user actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.user}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                    <span className="text-xs text-gray-500">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {activity.action}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activities →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
