"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Shield, Zap, Search } from "lucide-react"
import { Role } from "../types"
import { CreateRolePolicyRequest } from "../types/role-policy"
import { useRolePoliciesByRoleQuery, useCreateRolePolicyMutation, useDeleteRolePolicyMutation } from "../role-policies-hooks"
import { usePoliciesQuery } from "@/features/policies/hooks"
import { Policy } from "@/features/policies/types"
import toast from "react-hot-toast"

interface RolePolicyAssignmentProps {
  role: Role
}

export function RolePolicyAssignment({ role }: RolePolicyAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isToggling, setIsToggling] = useState<string | null>(null)
  
  // React Query hooks
  const { data: rolePolicies = [], isLoading: rolePoliciesLoading } = useRolePoliciesByRoleQuery(role.id)
  const { data: policiesData, isLoading: policiesLoading } = usePoliciesQuery({ page: 1, limit: 1000 })
  const createRolePolicyMutation = useCreateRolePolicyMutation()
  const deleteRolePolicyMutation = useDeleteRolePolicyMutation()
  
  const policies = policiesData?.data || []

  const handleTogglePolicy = async (policy: Policy, isAssigned: boolean) => {
    setIsToggling(policy.id)
    
    try {
      if (isAssigned) {
        // Find the role-policy assignment and delete it
        const assignment = rolePolicies.find(rp => rp.policyId === policy.id)
        if (assignment) {
          await deleteRolePolicyMutation.mutateAsync(assignment.id)
        }
      } else {
        // Create new assignment
        const data: CreateRolePolicyRequest = {
          roleId: role.id,
          policyId: policy.id,
          isActive: true
        }
        await createRolePolicyMutation.mutateAsync(data)
      }
    } catch (error) {
      // Error handling is done in the mutations
    } finally {
      setIsToggling(null)
    }
  }

  const isPolicyAssigned = (policyId: string) => {
    return rolePolicies.some(rp => rp.policyId === policyId)
  }

  const filteredPolicies = policies.filter(policy => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      policy.resource.code.toLowerCase().includes(search) ||
      policy.resource.name.toLowerCase().includes(search) ||
      policy.action.code.toLowerCase().includes(search) ||
      policy.action.name.toLowerCase().includes(search)
    )
  })

  const loading = rolePoliciesLoading || policiesLoading

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          disabled={loading}
        />
      </div>

      {/* Policies List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Loading policies...</p>
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No policies found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPolicies.map((policy) => {
            const isAssigned = isPolicyAssigned(policy.id)
            const isCurrentlyToggling = isToggling === policy.id

            return (
              <div
                key={policy.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center space-x-1">
                    <div className="h-8 w-8 rounded-sm bg-muted flex items-center justify-center border">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="h-8 w-8 rounded-sm bg-muted flex items-center justify-center border">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="font-mono text-sm font-medium">
                      {policy.resource.code} + {policy.action.code}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {policy.resource.name} + {policy.action.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`policy-${policy.id}`} className="text-sm cursor-pointer">
                    {isAssigned ? "Assigned" : "Not assigned"}
                  </Label>
                  <Switch
                    id={`policy-${policy.id}`}
                    checked={isAssigned}
                    onCheckedChange={() => handleTogglePolicy(policy, isAssigned)}
                    disabled={isCurrentlyToggling}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
