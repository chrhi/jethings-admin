"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Product } from "../types"
import { ProductForm } from "./product-form"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  onSubmit: (data: {
    name: string
    description?: string
    price: number
    sku: string
    category: string
    productTypeId: string
    stock: number
    images?: string[]
    isActive: boolean
    isFeatured: boolean
  }) => void
  loading?: boolean
}

export function ProductModal({
  open,
  onOpenChange,
  product,
  onSubmit,
  loading = false,
}: ProductModalProps) {
  const isEditing = !!product

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the product information below."
              : "Add a new product to the catalog."
            }
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
