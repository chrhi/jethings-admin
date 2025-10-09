"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Resource } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Shield, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const createResourceColumns = (
  onEdit?: (resource: Resource) => void,
  onDelete?: (resource: Resource) => void,
  onManageActions?: (resource: Resource) => void
): ColumnDef<Resource>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const resource = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-medium font-mono text-sm">{resource.code}</div>
            <div className="text-sm text-muted-foreground">{resource.name}</div>
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
    id: "manage-actions",
    header: "Actions",
    cell: ({ row }) => {
      const resource = row.original

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onManageActions?.(resource)}
          className="h-8 px-2"
        >
          <Zap className="h-4 w-4 mr-2" />
          Manage Actions
        </Button>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const resource = row.original

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
            <DropdownMenuItem onClick={() => onEdit?.(resource)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(resource)}
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
