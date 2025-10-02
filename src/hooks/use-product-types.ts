"use client"

import { useState, useEffect } from 'react'
import { ProductType, ProductTypeFilters, ProductTypeResponse, ProductTypeStats } from '@/features/products/types'

// Mock data for demonstration
const mockProductTypes: ProductType[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    isActive: true,
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
  },
  {
    id: '3',
    name: 'Books',
    description: 'Educational and entertainment books',
    isActive: false,
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
  },
  {
    id: '4',
    name: 'Home & Garden',
    description: 'Items for home improvement and gardening',
    isActive: true,
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
  {
    id: '5',
    name: 'Sports & Outdoors',
    description: 'Sporting goods and outdoor equipment',
    isActive: true,
    createdAt: '2024-01-19T16:10:00Z',
    updatedAt: '2024-01-19T16:10:00Z',
  },
]

export function useProductTypes(filters: ProductTypeFilters = {}) {
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProductTypes = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredTypes = [...mockProductTypes]
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredTypes = filteredTypes.filter(type => 
          type.name.toLowerCase().includes(searchLower) ||
          type.description?.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply status filter
      if (filters.isActive !== undefined) {
        filteredTypes = filteredTypes.filter(type => type.isActive === filters.isActive)
      }
      
      // Apply sorting
      const sortBy = filters.sortBy || 'createdAt'
      const sortOrder = filters.sortOrder || 'desc'
      
      filteredTypes.sort((a, b) => {
        const aValue = a[sortBy as keyof ProductType]
        const bValue = b[sortBy as keyof ProductType]
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return sortOrder === 'asc' ? comparison : -comparison
        }
        
        return 0
      })
      
      setProductTypes(filteredTypes)
    } catch (err) {
      setError('Failed to fetch product types')
      console.error('Error fetching product types:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductTypes()
  }, [filters.search, filters.isActive, filters.sortBy, filters.sortOrder])

  return {
    productTypes,
    loading,
    error,
    refetch: fetchProductTypes,
  }
}

export function useProductTypeStats() {
  const [stats, setStats] = useState<ProductTypeStats>({
    total: 0,
    active: 0,
    inactive: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const total = mockProductTypes.length
        const active = mockProductTypes.filter(type => type.isActive).length
        const inactive = total - active
        
        setStats({ total, active, inactive })
      } catch (error) {
        console.error('Error fetching product type stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

export function useProductTypeActions() {
  const [loading, setLoading] = useState(false)

  const createProductType = async (data: { name: string; description?: string; isActive: boolean }) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would make an API call
      console.log('Creating product type:', data)
      return { success: true, message: 'Product type created successfully' }
    } catch (error) {
      console.error('Error creating product type:', error)
      return { success: false, message: 'Failed to create product type' }
    } finally {
      setLoading(false)
    }
  }

  const updateProductType = async (id: string, data: { name?: string; description?: string; isActive?: boolean }) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would make an API call
      console.log('Updating product type:', id, data)
      return { success: true, message: 'Product type updated successfully' }
    } catch (error) {
      console.error('Error updating product type:', error)
      return { success: false, message: 'Failed to update product type' }
    } finally {
      setLoading(false)
    }
  }

  const deleteProductType = async (id: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would make an API call
      console.log('Deleting product type:', id)
      return { success: true, message: 'Product type deleted successfully' }
    } catch (error) {
      console.error('Error deleting product type:', error)
      return { success: false, message: 'Failed to delete product type' }
    } finally {
      setLoading(false)
    }
  }

  return {
    createProductType,
    updateProductType,
    deleteProductType,
    loading,
  }
}
