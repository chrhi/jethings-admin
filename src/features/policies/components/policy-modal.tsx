"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PolicyForm } from "./policy-form"
import { Policy, CreatePolicyRequest, UpdatePolicyRequest } from "../types"

interface PolicyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy?: Policy
  onSubmit: (data: CreatePolicyRequest | UpdatePolicyRequest) => void
  loading?: boolean
}

export function PolicyModal({
  open,
  onOpenChange,
  policy,
  onSubmit,
  loading = false,
}: PolicyModalProps) {
  const handleSubmit = (data: CreatePolicyRequest | UpdatePolicyRequest) => {
    onSubmit(data)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {policy ? "Edit Policy" : "Create Policy"}
          </DialogTitle>
          <DialogDescription>
            {policy 
              ? "Update the policy information below."
              : "Add a new policy to the system."
            }
          </DialogDescription>
        </DialogHeader>
        <PolicyForm
          policy={policy}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
