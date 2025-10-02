"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductTypeFilters } from "../types"

interface ProductTypeFiltersProps {
  filters: ProductTypeFilters
  onFiltersChange: (filters: ProductTypeFilters) => void
  onClearFilters: () => void
}

export function ProductTypeFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: ProductTypeFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value, page: 1 })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      isActive: value === 'all' ? undefined : value === 'active',
      page: 1 
    })
  }

  const hasActiveFilters = filters.search || filters.isActive !== undefined

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search product types..."
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select 
        value={
          filters.isActive === undefined 
            ? 'all' 
            : filters.isActive 
              ? 'active' 
              : 'inactive'
        } 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full md:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
