"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { UserActions } from "./components/user-actions"
import { ClickableUserName } from "./components/clickable-user-name"

export const createColumns = (onUserUpdate?: () => void): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      return <ClickableUserName user={user} />
    },
  },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[]
      return (
        <div className="flex space-x-1">
          {roles.map((role) => (
            <Badge 
              key={role} 
              variant={role === 'super_admin' ? 'destructive' : role === 'admin' ? 'default' : 'secondary'}
            >
              {role.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string
      return phone || "-"
    },
  },
  {
    accessorKey: "isEmailVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isEmailVerified") as boolean
      return (
        <Badge variant={isVerified ? "default" : "secondary"}>
          {isVerified ? "Verified" : "Unverified"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => {
      const lastActivity = row.getValue("lastActivity") as string
      return lastActivity ? format(new Date(lastActivity), "MMM dd, yyyy") : "-"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return format(new Date(createdAt), "MMM dd, yyyy")
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original
      return <UserActions user={user} onUserUpdate={onUserUpdate} />
    },
  },
]