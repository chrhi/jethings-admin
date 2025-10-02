"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductFilters } from "../types"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClearFilters: () => void
}

export function ProductFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: ProductFiltersProps) {
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

  const handleFeaturedChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      isFeatured: value === 'all' ? undefined : value === 'featured',
      page: 1 
    })
  }

  const handleStockChange = (value: string) => {
    let stockFilter: boolean | undefined = undefined
    if (value === 'in-stock') stockFilter = true
    if (value === 'out-of-stock') stockFilter = false
    
    onFiltersChange({ 
      ...filters, 
      inStock: stockFilter,
      page: 1 
    })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === 'all' ? undefined : value,
      page: 1 
    })
  }

  const hasActiveFilters = filters.search || 
    filters.isActive !== undefined || 
    filters.isFeatured !== undefined ||
    filters.inStock !== undefined ||
    filters.category

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
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
        <SelectTrigger className="w-full md:w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={
          filters.isFeatured === undefined 
            ? 'all' 
            : filters.isFeatured 
              ? 'featured' 
              : 'not-featured'
        } 
        onValueChange={handleFeaturedChange}
      >
        <SelectTrigger className="w-full md:w-[130px]">
          <SelectValue placeholder="Featured" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="not-featured">Not Featured</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={
          filters.inStock === undefined 
            ? 'all' 
            : filters.inStock 
              ? 'in-stock' 
              : 'out-of-stock'
        } 
        onValueChange={handleStockChange}
      >
        <SelectTrigger className="w-full md:w-[130px]">
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stock</SelectItem>
          <SelectItem value="in-stock">In Stock</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.category || 'all'} 
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full md:w-[130px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Electronics">Electronics</SelectItem>
          <SelectItem value="Clothing">Clothing</SelectItem>
          <SelectItem value="Books">Books</SelectItem>
          <SelectItem value="Home & Garden">Home & Garden</SelectItem>
          <SelectItem value="Sports">Sports</SelectItem>
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
