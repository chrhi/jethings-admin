"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Plus, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { useRoles } from "@/hooks/use-roles"
import { createRoleColumns, RoleModal, RoleFiltersComponent, RoleSheet } from "@/features/roles"
import { Role, RoleFilters, CreateRoleRequest, UpdateRoleRequest } from "@/features/roles/types"
import { useConfirmationContext } from "@/contexts/confirmation-context"

export default function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | undefined>()
  const [filters, setFilters] = useState<RoleFilters>({
    page: 1,
    limit: 10,
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const { openConfirmation } = useConfirmationContext()
  const {
    roles,
    loading,
    error,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  } = useRoles()

  useEffect(() => {
    fetchRoles(filters)
  }, [filters])

  const handleCreateRole = async (data: CreateRoleRequest) => {
    setActionLoading(true)
    try {
      const result = await createRole(data)
      if (result) {
        toast.success("Role created successfully")
        setModalOpen(false)
        fetchRoles(filters) // Refresh the list
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create role")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateRole = async (data: UpdateRoleRequest) => {
    if (!editingRole) return
    setActionLoading(true)
    try {
      const result = await updateRole(editingRole.id, data)
      if (result) {
        toast.success("Role updated successfully")
        setModalOpen(false)
        setEditingRole(undefined)
        fetchRoles(filters) // Refresh the list
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteRole = async (role: Role) => {
    openConfirmation(
      {
        title: "Delete Role",
        description: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
        variant: "destructive",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        setActionLoading(true)
        try {
          const success = await deleteRole(role.id)
          if (success) {
            toast.success("Role deleted successfully")
            fetchRoles(filters) // Refresh the list
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to delete role")
        } finally {
          setActionLoading(false)
        }
      }
    )
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setModalOpen(true)
  }

  const handleManageRole = (role: Role) => {
    setSelectedRole(role)
    setSheetOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingRole(undefined)
  }

  const handleSheetClose = () => {
    setSheetOpen(false)
    setSelectedRole(null)
  }

  const handleFiltersChange = (newFilters: RoleFilters) => {
    setFilters(newFilters)
  }

  const columns = createRoleColumns(handleEditRole, handleDeleteRole, handleManageRole)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Roles Management</h2>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Roles</span>
          </CardTitle>
          <CardDescription>
            A list of all roles in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
          <div className="mt-6">
            <DataTable
              columns={columns}
              data={roles}
              loading={loading}
            />

            {/* Simple pagination indicator */}
            {!loading && roles.length > 0 && (
              <div className="flex items-center justify-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {roles.length} of {pagination.total} roles
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <RoleModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        role={editingRole}
        onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
        loading={actionLoading}
      />

      {/* Sheet */}
      <RoleSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        role={selectedRole}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
      />
    </div>
  )
}
