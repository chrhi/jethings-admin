"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"
import { UserFilters } from "../types"

interface UserFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onReset: () => void
}

export function UserFiltersComponent({ filters, onFiltersChange, onReset }: UserFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    })
  }

  const handleRoleToggle = (role: string) => {
    const currentRoles = filters.roles || []
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    
    handleFilterChange('roles', newRoles.length > 0 ? newRoles : undefined)
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search users..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Filter by first name"
                value={filters.firstName || ''}
                onChange={(e) => handleFilterChange('firstName', e.target.value || undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Filter by last name"
                value={filters.lastName || ''}
                onChange={(e) => handleFilterChange('lastName', e.target.value || undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Filter by email"
                value={filters.email || ''}
                onChange={(e) => handleFilterChange('email', e.target.value || undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Filter by phone"
                value={filters.phoneNumber || ''}
                onChange={(e) => handleFilterChange('phoneNumber', e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email Verification</Label>
              <Select
                value={filters.isEmailVerified?.toString() || ''}
                onValueChange={(value) => 
                  handleFilterChange('isEmailVerified', value === '' ? undefined : value === 'true')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All verification status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Select
                value={filters.isActive?.toString() || ''}
                onValueChange={(value) => 
                  handleFilterChange('isActive', value === '' ? undefined : value === 'true')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All account status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Role Filters */}
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-2">
              {['user', 'admin', 'super_admin'].map((role) => (
                <Button
                  key={role}
                  variant={filters.roles?.includes(role) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoleToggle(role)}
                >
                  {role.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Items per page</Label>
              <Select
                value={filters.limit?.toString() || '10'}
                onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select
                value={filters.sortBy || 'createdAt'}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                  <SelectItem value="firstName">First Name</SelectItem>
                  <SelectItem value="lastName">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="lastActivity">Last Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <div className="flex space-x-2">
              <Button
                variant={filters.sortOrder === 'asc' ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('sortOrder', 'asc')}
              >
                Ascending
              </Button>
              <Button
                variant={filters.sortOrder === 'desc' ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('sortOrder', 'desc')}
              >
                Descending
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {filters.search}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('search', undefined)}
                    />
                  </Badge>
                )}
                {filters.roles?.map((role) => (
                  <Badge key={role} variant="secondary" className="flex items-center gap-1">
                    Role: {role.replace('_', ' ')}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRoleToggle(role)}
                    />
                  </Badge>
                ))}
                {filters.isEmailVerified !== undefined && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Verified: {filters.isEmailVerified ? 'Yes' : 'No'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('isEmailVerified', undefined)}
                    />
                  </Badge>
                )}
                {filters.isActive !== undefined && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Active: {filters.isActive ? 'Yes' : 'No'}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('isActive', undefined)}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onReset}>
              Reset Filters
            </Button>
            <Button onClick={() => setIsExpanded(false)}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
