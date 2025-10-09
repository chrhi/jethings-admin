"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"
import { ActionFilters } from "../types"
import { useResources } from "@/hooks/use-resources"

interface ActionFiltersComponentProps {
  filters: ActionFilters
  onFiltersChange: (filters: ActionFilters) => void
  loading?: boolean
}

export function ActionFiltersComponent({
  filters,
  onFiltersChange,
  loading = false,
}: ActionFiltersComponentProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "")
  const [statusFilter, setStatusFilter] = useState(filters.isActive !== undefined ? String(filters.isActive) : "all")
  const [resourceFilter, setResourceFilter] = useState(filters.resourceId || "")
  const [resources, setResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(false)

  const { fetchResources, resources: allResources } = useResources()

  // Update local state when filters change
  useEffect(() => {
    setSearchTerm(filters.search || "")
    setStatusFilter(filters.isActive !== undefined ? String(filters.isActive) : "all")
    setResourceFilter(filters.resourceId || "")
  }, [filters])

  // Load resources for dropdown
  useEffect(() => {
    const loadData = async () => {
      setLoadingResources(true)
      
      try {
        await fetchResources({ page: 1, limit: 100 })
      } catch (error) {
        console.error('Error loading resources:', error)
      } finally {
        setLoadingResources(false)
      }
    }

    loadData()
  }, [fetchResources])

  // Update local state when hooks data changes
  useEffect(() => {
    setResources(allResources)
  }, [allResources])

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

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setResourceFilter("")
    onFiltersChange({
      page: 1,
      limit: filters.limit || 10,
    })
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || resourceFilter

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Search actions..."
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
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter === "true" ? "Active" : "Inactive"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusChange("all")}
              />
            </Badge>
          )}
          {resourceFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Resource: {resources.find(r => r.id === resourceFilter)?.code || resourceFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleResourceChange("")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
