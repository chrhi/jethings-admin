"use client"

import { useState, useEffect, useCallback } from "react"
import { RoleFilters } from "../types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"

interface RoleFiltersComponentProps {
  filters: RoleFilters
  onFiltersChange: (filters: RoleFilters) => void
  loading?: boolean
}

export function RoleFiltersComponent({ filters, onFiltersChange, loading = false }: RoleFiltersComponentProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "")
  const [statusFilter, setStatusFilter] = useState(filters.isActive !== undefined ? String(filters.isActive) : "all")

  useEffect(() => {
    setSearchTerm(filters.search || "")
    setStatusFilter(filters.isActive !== undefined ? String(filters.isActive) : "all")
  }, [filters])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1,
    })
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    onFiltersChange({
      ...filters,
      isActive: value === "all" ? undefined : value === "true",
      page: 1,
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    onFiltersChange({ page: 1, limit: filters.limit })
  }

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
              disabled={loading}
            />
          </div>
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

        {/* Clear Filters Button */}
        <div className="flex items-end">
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

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Active Filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleSearchChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter === "true" ? "Active" : "Inactive"}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleStatusChange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
