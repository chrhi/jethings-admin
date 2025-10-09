"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { PolicyFilters, Resource, Action } from "../types"
import { useResources } from "@/hooks/use-resources"
import { useActions } from "@/hooks/use-actions"

interface PolicyFiltersComponentProps {
  filters: PolicyFilters
  onFiltersChange: (filters: PolicyFilters) => void
  loading?: boolean
}

export function PolicyFiltersComponent({
  filters,
  onFiltersChange,
  loading = false,
}: PolicyFiltersComponentProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "")
  const [statusFilter, setStatusFilter] = useState<string>(
    filters.isActive !== undefined ? String(filters.isActive) : "all"
  )
  const [resourceFilter, setResourceFilter] = useState(filters.resourceId || "")
  const [actionFilter, setActionFilter] = useState(filters.actionId || "")
  
  const [resources, setResources] = useState<Resource[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [loadingResources, setLoadingResources] = useState(false)
  const [loadingActions, setLoadingActions] = useState(false)

  const { fetchResources, resources: allResources } = useResources()
  const { fetchActions, actions: allActions } = useActions()

  useEffect(() => {
    setSearchTerm(filters.search || "")
    setStatusFilter(filters.isActive !== undefined ? String(filters.isActive) : "all")
    setResourceFilter(filters.resourceId || "")
    setActionFilter(filters.actionId || "")
  }, [filters])

  // Load resources and actions for dropdowns
  useEffect(() => {
    const loadData = async () => {
      setLoadingResources(true)
      setLoadingActions(true)
      
      try {
        await Promise.all([
          fetchResources({ page: 1, limit: 100 }),
          fetchActions({ page: 1, limit: 100 })
        ])
      } catch (error) {
        console.error('Error loading resources/actions:', error)
      } finally {
        setLoadingResources(false)
        setLoadingActions(false)
      }
    }

    loadData()
  }, [fetchResources, fetchActions])

  // Update local state when hooks data changes
  useEffect(() => {
    setResources(allResources)
  }, [allResources])

  useEffect(() => {
    setActions(allActions)
  }, [allActions])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1, // Reset to first page when searching
    })
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    onFiltersChange({
      ...filters,
      isActive: value === "all" ? undefined : value === "true",
      page: 1, // Reset to first page when filtering
    })
  }

  const handleResourceChange = (value: string) => {
    const newValue = value === "all" ? "" : value
    setResourceFilter(newValue)
    onFiltersChange({
      ...filters,
      resourceId: newValue || undefined,
      page: 1, // Reset to first page when filtering
    })
  }

  const handleActionChange = (value: string) => {
    const newValue = value === "all" ? "" : value
    setActionFilter(newValue)
    onFiltersChange({
      ...filters,
      actionId: newValue || undefined,
      page: 1, // Reset to first page when filtering
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setResourceFilter("")
    setActionFilter("")
    onFiltersChange({
      page: 1,
      limit: filters.limit || 10,
    })
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || resourceFilter || actionFilter

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Resource Filter */}
        <div className="space-y-2">
          <Label htmlFor="resource">Resource</Label>
          <Select value={resourceFilter || "all"} onValueChange={handleResourceChange} disabled={loading || loadingResources}>
            <SelectTrigger>
              <SelectValue placeholder="All resources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All resources</SelectItem>
              {resources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm">{resource.code}</span>
                    <span className="text-xs text-muted-foreground">{resource.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Filter */}
        <div className="space-y-2">
          <Label htmlFor="action">Action</Label>
          <Select value={actionFilter || "all"} onValueChange={handleActionChange} disabled={loading || loadingActions}>
            <SelectTrigger>
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((action) => (
                <SelectItem key={action.id} value={action.id}>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm">{action.code}</span>
                    <span className="text-xs text-muted-foreground">{action.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={handleStatusChange} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters || loading}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={() => handleSearchChange("")}
                className="hover:bg-primary/20 rounded p-0.5"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {resourceFilter && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Resource: {resources.find(r => r.id === resourceFilter)?.code}</span>
              <button
                onClick={() => handleResourceChange("")}
                className="hover:bg-primary/20 rounded p-0.5"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {actionFilter && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Action: {actions.find(a => a.id === actionFilter)?.code}</span>
              <button
                onClick={() => handleActionChange("")}
                className="hover:bg-primary/20 rounded p-0.5"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {statusFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <span>Status: {statusFilter === "true" ? "Active" : "Inactive"}</span>
              <button
                onClick={() => handleStatusChange("all")}
                className="hover:bg-primary/20 rounded p-0.5"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
