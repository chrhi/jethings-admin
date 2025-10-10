"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Role } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Lock, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const createRoleColumns = (
  onEdit?: (role: Role) => void,
  onDelete?: (role: Role) => void,
  onManage?: (role: Role) => void
): ColumnDef<Role>[] => [
  {
    accessorKey: "code",
    header: "Role Code",
    cell: ({ row }) => {
      const role = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-medium font-mono text-sm">{role.code}</div>
            <div className="text-sm text-muted-foreground">{role.name}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return (
        <div className="text-sm text-muted-foreground max-w-[200px] line-clamp-2">
          {description || "No description"}
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="text-sm">
          {format(new Date(createdAt), "MMM dd, yyyy")}
        </div>
      )
    },
  },
  {
    id: "manage",
    header: "",
    cell: ({ row }) => {
      const role = row.original

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onManage?.(role)}
          className="h-8"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const role = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit?.(role)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(role)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]