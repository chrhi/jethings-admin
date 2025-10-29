"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Store } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Store as StoreIcon, User, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const createColumns = (

  onStoreDelete?: (store: Store) => void,
  onStatusChange?: (store: Store, status: 'accepted' | 'rejected') => void
): ColumnDef<Store>[] => [
  {
    accessorKey: "name",
    header: "Nom du magasin",
    cell: ({ row }) => {
      const store = row.original
      return (
        <div className="flex items-center space-x-3">
         
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <StoreIcon className="h-4 w-4 text-muted-foreground" />
            </div>
       
          <div className="space-y-1">
            <div className="font-medium">{store.name}</div>
            {store.description && (
              <div className="text-sm text-muted-foreground line-clamp-1">
                {store.description}
              </div>
            )}
          </div>
        </div>
      )
    },
  },
 
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const store = row.original
      const statusConfig = {
        accepted: { label: "Accepté", variant: "default" as const },
        rejected: { label: "Rejeté", variant: "destructive" as const },
        pending: { label: "En attente", variant: "secondary" as const },
      }
      
      const config = statusConfig[store.status]
      
      return (
        <Badge variant={config.variant}>
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Actif",
    cell: ({ row }) => {
      const store = row.original
      return (
        <Badge variant={store.isActive ? "default" : "secondary"}>
          {store.isActive ? "Oui" : "Non"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const store = row.original
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            {format(new Date(store.createdAt), "dd MMM yyyy")}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const store = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            {store.status === 'pending' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onStatusChange?.(store, 'accepted')}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accepter
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange?.(store, 'rejected')}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onStoreDelete?.(store)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
