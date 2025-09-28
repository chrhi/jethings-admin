"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Store } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { MapPin, Phone, Mail } from "lucide-react"

export const createColumns = (onStoreUpdate?: () => void): ColumnDef<Store>[] => [
  {
    accessorKey: "name",
    header: "Nom du magasin",
    cell: ({ row }) => {
      const store = row.original
      return (
        <div className="space-y-1">
          <div className="font-medium">{store.name}</div>
          <div className="text-sm text-muted-foreground">
            {store.city}, {store.country}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => {
      const store = row.original
      return (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div className="space-y-1">
            <div className="text-sm">{store.address}</div>
            <div className="text-xs text-muted-foreground">
              {store.postalCode} {store.city}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const store = row.original
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{store.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{store.email}</span>
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
        approved: { label: "Approuvé", variant: "default" as const, color: "bg-green-100 text-green-800" },
        rejected: { label: "Rejeté", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
        inactive: { label: "Inactif", variant: "secondary" as const, color: "bg-orange-100 text-orange-800" },
        pending: { label: "En attente", variant: "outline" as const, color: "bg-yellow-100 text-yellow-800" },
      }
      
      const config = statusConfig[store.status]
      
      return (
        <Badge variant={config.variant} className={config.color}>
          {config.label}
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
        <div className="text-sm">
          {format(new Date(store.createdAt), "dd MMM yyyy")}
        </div>
      )
    },
  },
]
