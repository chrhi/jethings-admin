"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductType } from "../types"
import { ProductTypeForm } from "./product-type-form"

interface ProductTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productType?: ProductType
  onSubmit: (data: { name: string; description?: string; isActive: boolean }) => void
  loading?: boolean
}

export function ProductTypeModal({
  open,
  onOpenChange,
  productType,
  onSubmit,
  loading = false,
}: ProductTypeModalProps) {
  const isEditing = !!productType

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product Type" : "Create Product Type"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the product type information below."
              : "Add a new product type to the system."
            }
          </DialogDescription>
        </DialogHeader>
        <ProductTypeForm
          productType={productType}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
