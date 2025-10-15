"use client"

import { useState, useEffect } from "react"
import { User } from "../types"
import { UserRoleWithDetails } from "../user-role-types"
import { Role } from "@/features/roles/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  useUserRolesByUserQuery, 
  useAssignRoleMutation, 
  useUnassignRoleMutation 
} from "../user-role-hooks"
import { useRolesQuery } from "@/features/roles/hooks"
import { Shield, X, Search, Loader2, Plus } from "lucide-react"
import toast from "react-hot-toast"

interface UserRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

export function UserRoleModal({ open, onOpenChange, user }: UserRoleModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAssigning, setIsAssigning] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  // Fetch user's current roles
  const { data: userRoles = [], isLoading: userRolesLoading, refetch: refetchUserRoles } = useUserRolesByUserQuery(user.id)
  
  // Fetch all available roles
  const { data: rolesData, isLoading: rolesLoading } = useRolesQuery({ page: 1, limit: 1000 })
  const roles = rolesData?.data || []

  // Mutations
  const assignRoleMutation = useAssignRoleMutation()
  const unassignRoleMutation = useUnassignRoleMutation()

  // Get assigned role IDs
  const assignedRoleIds = userRoles.map(ur => ur.roleId)

  // Filter available roles (not assigned to user)
  const availableRoles = roles.filter(role => 
    role.isActive && !assignedRoleIds.includes(role.id)
  )

  // Filter roles by search term
  const filteredAvailableRoles = availableRoles.filter(role => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      role.name.toLowerCase().includes(search) ||
      role.code.toLowerCase().includes(search) ||
      (role.description && role.description.toLowerCase().includes(search))
    )
  })

  const handleAssignRole = async (roleId: string) => {
    setIsAssigning(roleId)
    try {
      await assignRoleMutation.mutateAsync({
        userId: user.id,
        roleId,
        isActive: true
      })
      refetchUserRoles()
    } catch (error) {
      // Error is handled by the mutation hook
    } finally {
      setIsAssigning(null)
    }
  }

  const handleRemoveRole = async (userRoleId: string) => {
    setIsRemoving(userRoleId)
    try {
      await unassignRoleMutation.mutateAsync(userRoleId)
      refetchUserRoles()
    } catch (error) {
      // Error is handled by the mutation hook
    } finally {
      setIsRemoving(null)
    }
  }

  const isLoading = userRolesLoading || rolesLoading
  const isAnyActionPending = assignRoleMutation.isPending || unassignRoleMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gérer les rôles - {user.firstName} {user.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Roles Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Rôles actuels</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : userRoles.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucun rôle assigné</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userRoles.map((userRole) => (
                  <Badge 
                    key={userRole.id} 
                    variant="default" 
                    className="flex items-center gap-1 pr-1"
                  >
                    <Shield className="h-3 w-3" />
                    {userRole.role.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveRole(userRole.id)}
                      disabled={isRemoving === userRole.id || isAnyActionPending}
                    >
                      {isRemoving === userRole.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Available Roles Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Rôles disponibles</h3>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Roles List */}
            <div className="h-64 overflow-y-auto border rounded-lg p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredAvailableRoles.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  {searchTerm ? "Aucun rôle trouvé" : "Aucun rôle disponible"}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableRoles.map((role) => (
                    <div 
                      key={role.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{role.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {role.code}
                          </Badge>
                        </div>
                        {role.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignRole(role.id)}
                        disabled={isAssigning === role.id || isAnyActionPending}
                        className="ml-2"
                      >
                        {isAssigning === role.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Assigner
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
