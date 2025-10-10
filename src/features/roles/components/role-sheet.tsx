"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Lock, Edit, Trash2 } from "lucide-react"
import { Role } from "../types"
import { RolePolicyAssignment } from "./role-policy-assignment"

interface RoleSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onEdit?: (role: Role) => void
  onDelete?: (role: Role) => void
}

export function RoleSheet({
  open,
  onOpenChange,
  role,
  onEdit,
  onDelete,
}: RoleSheetProps) {
  const [localRole, setLocalRole] = useState<Role | null>(role)

  // Update local state when role prop changes
  if (role && role.id !== localRole?.id) {
    setLocalRole(role)
  }

  if (!localRole) return null

  const handleEdit = () => {
    if (onEdit) {
      onEdit(localRole)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(localRole)
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[900px] sm:max-w-[900px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">Role Details</div>
                <div className="text-sm text-muted-foreground font-mono">{localRole.code}</div>
              </div>
            </SheetTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <SheetDescription>
            Manage role permissions and configurations for "{localRole.name}"
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 px-4 pb-6">
          {/* Policy Assignments */}
          <RolePolicyAssignment role={localRole} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
