"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"
import { ResourceFilters } from "../types"

interface ResourceFiltersProps {
  filters: ResourceFilters
  onFiltersChange: (filters: ResourceFilters) => void
  loading?: boolean
}

export function ResourceFiltersComponent({
  filters,
  onFiltersChange,
  loading = false,
}: ResourceFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "")

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      search: searchValue.trim() || undefined,
      page: 1, // Reset to first page when searching
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleStatusChange = (status: string) => {
    let isActive: boolean | undefined
    if (status === "active") isActive = true
    else if (status === "inactive") isActive = false
    else isActive = undefined

    onFiltersChange({
      ...filters,
      isActive,
      page: 1, // Reset to first page when filtering
    })
  }

  const clearFilters = () => {
    setSearchValue("")
    onFiltersChange({
      page: 1,
      limit: filters.limit || 10,
    })
  }

  const hasActiveFilters = filters.search || filters.isActive !== undefined

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by code, name, or description..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            disabled={loading}
            size="sm"
            className="px-4"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          <Select
            value={
              filters.isActive === true ? "active" : 
              filters.isActive === false ? "inactive" : 
              "all"
            }
            onValueChange={handleStatusChange}
            disabled={loading}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Active filters:</span>
          </div>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSearchValue("")
                  onFiltersChange({
                    ...filters,
                    search: undefined,
                    page: 1,
                  })
                }}
              />
            </Badge>
          )}
          
          {filters.isActive !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.isActive ? "Active" : "Inactive"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusChange("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
