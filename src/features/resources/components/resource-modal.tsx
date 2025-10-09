"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Resource } from "../types"
import { ResourceForm } from "./resource-form"

interface ResourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource?: Resource
  onSubmit: (data: {
    code: string
    name: string
    description?: string
    isActive: boolean
  }) => void
  loading?: boolean
}

export function ResourceModal({
  open,
  onOpenChange,
  resource,
  onSubmit,
  loading = false,
}: ResourceModalProps) {
  const isEditing = !!resource

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Resource" : "Create Resource"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the resource information below."
              : "Add a new RBAC resource definition."
            }
          </DialogDescription>
        </DialogHeader>
        <ResourceForm
          resource={resource}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
