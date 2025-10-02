"use client"

import { useState, useEffect } from 'react'
import { Product, ProductFilters, ProductResponse, ProductStats } from '@/features/products/types'

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 129.99,
    sku: 'WBH-001',
    category: 'Electronics',
    productTypeId: '1',
    productTypeName: 'Electronics',
    stock: 45,
    images: ['/products/headphones.jpg'],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors',
    price: 24.99,
    sku: 'CTS-002',
    category: 'Clothing',
    productTypeId: '2',
    productTypeName: 'Clothing',
    stock: 120,
    images: ['/products/tshirt.jpg'],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
  },
  {
    id: '3',
    name: 'JavaScript Programming Book',
    description: 'Complete guide to modern JavaScript development',
    price: 39.99,
    sku: 'JSB-003',
    category: 'Books',
    productTypeId: '3',
    productTypeName: 'Books',
    stock: 0,
    images: ['/products/js-book.jpg'],
    isActive: false,
    isFeatured: false,
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
  },
  {
    id: '4',
    name: 'Garden Watering Can',
    description: 'Durable metal watering can for your garden needs',
    price: 18.50,
    sku: 'GWC-004',
    category: 'Home & Garden',
    productTypeId: '4',
    productTypeName: 'Home & Garden',
    stock: 8,
    images: ['/products/watering-can.jpg'],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
  {
    id: '5',
    name: 'Professional Tennis Racket',
    description: 'Lightweight carbon fiber tennis racket for advanced players',
    price: 199.99,
    sku: 'PTR-005',
    category: 'Sports',
    productTypeId: '5',
    productTypeName: 'Sports & Outdoors',
    stock: 25,
    images: ['/products/tennis-racket.jpg'],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-19T16:10:00Z',
    updatedAt: '2024-01-19T16:10:00Z',
  },
  {
    id: '6',
    name: 'Smartphone Case',
    description: 'Protective silicone case for latest smartphone models',
    price: 12.99,
    sku: 'SPC-006',
    category: 'Electronics',
    productTypeId: '1',
    productTypeName: 'Electronics',
    stock: 3,
    images: ['/products/phone-case.jpg'],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T08:15:00Z',
  },
]

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredProducts = [...mockProducts]
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply status filter
      if (filters.isActive !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.isActive === filters.isActive)
      }

      // Apply featured filter
      if (filters.isFeatured !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.isFeatured === filters.isFeatured)
      }

      // Apply stock filter
      if (filters.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          filters.inStock ? product.stock > 0 : product.stock === 0
        )
      }

      // Apply category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category)
      }

      // Apply price filters
      if (filters.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= filters.priceMin!)
      }
      if (filters.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= filters.priceMax!)
      }
      
      // Apply sorting
      const sortBy = filters.sortBy || 'createdAt'
      const sortOrder = filters.sortOrder || 'desc'
      
      filteredProducts.sort((a, b) => {
        const aValue = a[sortBy as keyof Product]
        const bValue = b[sortBy as keyof Product]
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return sortOrder === 'asc' ? comparison : -comparison
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        return 0
      })
      
      setProducts(filteredProducts)
    } catch (err) {
      setError('Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [
    filters.search, 
    filters.isActive, 
    filters.isFeatured, 
    filters.inStock, 
    filters.category, 
    filters.priceMin, 
    filters.priceMax, 
    filters.sortBy, 
    filters.sortOrder
  ])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  }
}

export function useProductStats() {
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
    outOfStock: 0,
    lowStock: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const total = mockProducts.length
        const active = mockProducts.filter(product => product.isActive).length
        const inactive = total - active
        const featured = mockProducts.filter(product => product.isFeatured).length
        const outOfStock = mockProducts.filter(product => product.stock === 0).length
        const lowStock = mockProducts.filter(product => product.stock > 0 && product.stock <= 10).length
        
        setStats({ total, active, inactive, featured, outOfStock, lowStock })
      } catch (error) {
        console.error('Error fetching product stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

export function useProductActions() {
  const [loading, setLoading] = useState(false)

  const createProduct = async (data: {
    name: string
    description?: string
    price: number
    sku: string
    category: string
    productTypeId: string
    stock: number
    images?: string[]
    isActive: boolean
    isFeatured: boolean
  }) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would make an API call
      console.log('Creating product:', data)
      return { success: true, message: 'Product created successfully' }
    } catch (error) {
      console.error('Error creating product:', error)
      return { success: false, message: 'Failed to create product' }
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, data: {
    name?: string
    description?: string
    price?: number
    sku?: string
    category?: string
    productTypeId?: string
    stock?: number
    images?: string[]
    isActive?: boolean
    isFeatured?: boolean
  }) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would make an API call
      console.log('Updating product:', id, data)
      return { success: true, message: 'Product updated successfully' }
    } catch (error) {
      console.error('Error updating product:', error)
      return { success: false, message: 'Failed to update product' }
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, this would make an API call
      console.log('Deleting product:', id)
      return { success: true, message: 'Product deleted successfully' }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { success: false, message: 'Failed to delete product' }
    } finally {
      setLoading(false)
    }
  }

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  }
}
