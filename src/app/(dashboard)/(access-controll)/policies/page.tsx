"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Plus, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { usePolicies } from "@/hooks/use-policies"
import { createPolicyColumns, PolicyModal, PolicyFiltersComponent, PolicySheet } from "@/features/policies"
import { Policy, PolicyFilters, CreatePolicyRequest, UpdatePolicyRequest } from "@/features/policies/types"
import { useConfirmationContext } from "@/contexts/confirmation-context"

export default function PoliciesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | undefined>()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [filters, setFilters] = useState<PolicyFilters>({
    page: 1,
    limit: 10,
  })
  const [actionLoading, setActionLoading] = useState(false)

  const { openConfirmation } = useConfirmationContext()
  const { 
    policies, 
    loading, 
    error, 
    pagination, 
    fetchPolicies, 
    createPolicy, 
    updatePolicy, 
    deletePolicy 
  } = usePolicies()

  useEffect(() => {
    fetchPolicies(filters)
  }, [filters])

  const handleCreatePolicy = async (data: CreatePolicyRequest) => {
    setActionLoading(true)
    try {
      const result = await createPolicy(data)
      if (result) {
        toast.success("Policy created successfully")
        setModalOpen(false)
        fetchPolicies(filters) // Refresh the list
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create policy")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdatePolicy = async (data: UpdatePolicyRequest) => {
    if (!editingPolicy) return

    setActionLoading(true)
    try {
      const result = await updatePolicy(editingPolicy.id, data)
      if (result) {
        toast.success("Policy updated successfully")
        setModalOpen(false)
        setEditingPolicy(undefined)
        fetchPolicies(filters) 
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update policy")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePolicy = async (policy: Policy) => {
    openConfirmation(
      {
        title: "Delete Policy",
        description: `Are you sure you want to delete the policy "${policy.resource.name} + ${policy.action.name}"? This action cannot be undone.`,
        variant: "destructive",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      async () => {
        try {
          const success = await deletePolicy(policy.id)
          if (success) {
            toast.success("Policy deleted successfully")
            fetchPolicies(filters) // Refresh the list
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to delete policy")
        }
      }
    )
  }

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingPolicy(undefined)
  }

  const handleFiltersChange = (newFilters: PolicyFilters) => {
    setFilters(newFilters)
  }

  const handleManagePolicy = (policy: Policy) => {
    setSelectedPolicy(policy)
    setSheetOpen(true)
  }

  const handleSheetClose = () => {
    setSheetOpen(false)
    setSelectedPolicy(null)
  }

  const columns = createPolicyColumns(handleEditPolicy, handleDeletePolicy, handleManagePolicy)

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fetchPolicies(filters)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Policies</h1>
            <p className="text-muted-foreground">
              Manage access control policies
            </p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Search and filter policies by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PolicyFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Policies</CardTitle>
          <CardDescription>
            {pagination.total} policy{pagination.total !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={policies}
            loading={loading}
          />
          
          {/* Simple pagination indicator */}
          {!loading && policies.length > 0 && (
            <div className="flex items-center justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {policies.length} of {pagination.total} policies
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <PolicyModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        policy={editingPolicy}
        onSubmit={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
        loading={actionLoading}
      />

      {/* Policy Sheet */}
      <PolicySheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        policy={selectedPolicy}
      />
    </div>
  )
}
