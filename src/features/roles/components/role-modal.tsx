"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Role } from "../types"
import { RoleForm } from "./role-form"

interface RoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role
  onSubmit: (data: {
    code: string
    name: string
    description?: string
    isActive: boolean
  }) => void
  loading?: boolean
}

export function RoleModal({
  open,
  onOpenChange,
  role,
  onSubmit,
  loading = false,
}: RoleModalProps) {
  const isEditing = !!role

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Role" : "Create Role"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the role information below."
              : "Add a new RBAC role definition."
            }
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          role={role}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
