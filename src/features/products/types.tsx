export interface ProductType {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductTypeRequest {
  name: string
  description?: string
}

export interface UpdateProductTypeRequest {
  name?: string
  description?: string
  isActive?: boolean
}

export interface ProductTypeFilters {
  search?: string
  name?: string
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductTypeResponse {
  productTypes: ProductType[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ProductTypeStats {
  total: number
  active: number
  inactive: number
}

export interface ApiError {
  message: string
  statusCode: number
}

// Product interfaces
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  sku: string
  category: string
  productTypeId: string
  productTypeName?: string
  stock: number
  images?: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  sku: string
  category: string
  productTypeId: string
  stock: number
  images?: string[]
  isFeatured?: boolean
}

export interface UpdateProductRequest {
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
}

export interface ProductFilters {
  search?: string
  name?: string
  category?: string
  productTypeId?: string
  priceMin?: number
  priceMax?: number
  isActive?: boolean
  isFeatured?: boolean
  inStock?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProductResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  featured: number
  outOfStock: number
  lowStock: number
}
