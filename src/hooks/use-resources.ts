"use client"

import { useState, useEffect, useCallback } from "react"
import { Resource , ResourceFilters, ResourceResponse, CreateResourceRequest, UpdateResourceRequest } from "@/features/resources"
import { resourceService } from "@/lib/resource-service"

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchResources = useCallback(async (filters: ResourceFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const data = await resourceService.getResources(filters)
      setResources(data.data)
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch resources")
    } finally {
      setLoading(false)
    }
  }, [])

  const createResource = async (resourceData: CreateResourceRequest): Promise<Resource | null> => {
    try {
      const newResource = await resourceService.createResource(resourceData)
      setResources(prev => [newResource, ...prev])
      return newResource
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create resource")
      return null
    }
  }

  const updateResource = async (id: string, resourceData: UpdateResourceRequest): Promise<Resource | null> => {
    try {
      const updatedResource = await resourceService.updateResource(id, resourceData)
      setResources(prev => prev.map(r => r.id === id ? updatedResource : r))
      return updatedResource
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update resource")
      return null
    }
  }

  const deleteResource = async (id: string): Promise<boolean> => {
    try {
      await resourceService.deleteResource(id)
      setResources(prev => prev.filter(r => r.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete resource")
      return false
    }
  }

  return {
    resources,
    loading,
    error,
    pagination,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
  }
}

