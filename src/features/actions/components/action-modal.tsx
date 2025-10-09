"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Action } from "../types"
import { ActionForm } from "./action-form"

interface ActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: Action
  onSubmit: (data: {
    code: string
    name: string
    description?: string
    isActive: boolean
  }) => void
  loading?: boolean
}

export function ActionModal({
  open,
  onOpenChange,
  action,
  onSubmit,
  loading = false,
}: ActionModalProps) {
  const isEditing = !!action

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Action" : "Create Action"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the action information below."
              : "Add a new RBAC action definition."
            }
          </DialogDescription>
        </DialogHeader>
        <ActionForm
          action={action}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
