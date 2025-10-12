"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InviteUserForm } from "./invite-user-form"
import { useCreateInvitationMutation } from "../hooks"
import { CreateInvitationDto } from "../types"
import { UserPlus } from "lucide-react"

export const InviteUserModal = () => {
  const [open, setOpen] = useState(false)
  const createInvitationMutation = useCreateInvitationMutation()

  const handleSubmit = async (data: CreateInvitationDto) => {
    try {
      await createInvitationMutation.mutateAsync(data)
      setOpen(false)
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join the platform. They will receive an email with instructions to create their account.
          </DialogDescription>
        </DialogHeader>
        <InviteUserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={createInvitationMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}