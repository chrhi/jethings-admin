"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Star, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const createProductColumns = (
  onEdit?: (product: Product) => void,
  onDelete?: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center space-x-3">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="h-10 w-10 rounded-sm object-cover border"
            />
          ) : (
            <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-1">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
            {product.description && (
              <div className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                {product.description}
              </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{product.category}</div>
          {product.productTypeName && (
            <div className="text-xs text-muted-foreground">
              Type: {product.productTypeName}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number
      return (
        <div className="font-medium">
          ${price.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: "Out of stock", variant: "destructive" as const }
        if (stock <= 10) return { label: `${stock} (Low)`, variant: "warning" as const }
        return { label: stock.toString(), variant: "success" as const }
      }
      
      const stockStatus = getStockStatus(stock)
      
      return (
        <Badge variant={stockStatus.variant}>
          {stockStatus.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex flex-col space-y-1">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
          {product.isFeatured && (
            <Badge variant="info" className="w-fit">
              <Star className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original

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
            <DropdownMenuItem onClick={() => onEdit?.(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(product)}
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
