"use client"

import { useState, useEffect, useCallback } from "react"
import { Policy, PolicyFilters, PolicyResponse, CreatePolicyRequest, UpdatePolicyRequest } from "@/features/policies/types"
import { policyService } from "@/lib/policy-service"

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchPolicies = useCallback(async (filters: PolicyFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const data = await policyService.getPolicies(filters)
      setPolicies(data.data)
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch policies")
    } finally {
      setLoading(false)
    }
  }, [])

  const createPolicy = async (policyData: CreatePolicyRequest): Promise<Policy | null> => {
    try {
      const newPolicy = await policyService.createPolicy(policyData)
      setPolicies(prev => [newPolicy, ...prev])
      return newPolicy
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create policy")
      return null
    }
  }

  const updatePolicy = async (id: string, policyData: UpdatePolicyRequest): Promise<Policy | null> => {
    try {
      const updatedPolicy = await policyService.updatePolicy(id, policyData)
      setPolicies(prev => prev.map(p => p.id === id ? updatedPolicy : p))
      return updatedPolicy
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update policy")
      return null
    }
  }

  const deletePolicy = async (id: string): Promise<boolean> => {
    try {
      await policyService.deletePolicy(id)
      setPolicies(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete policy")
      return false
    }
  }

  return {
    policies,
    loading,
    error,
    pagination,
    fetchPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
  }
}
