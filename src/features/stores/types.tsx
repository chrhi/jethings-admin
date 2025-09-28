export interface Store {
  id: string
  name: string
  address: string
  phone: string
  email: string
  status: 'pending' | 'approved' | 'rejected' | 'inactive'
  manager: string
  managerEmail: string
  createdAt: string
  updatedAt: string
  description?: string
  city: string
  country: string
  postalCode: string
  totalSales?: number
  monthlySales?: number
  totalOrders?: number
  customerCount?: number
}

export interface StoreStats {
  totalStores: number
  activeStores: number
  pendingStores: number
  rejectedStores: number
  totalSales: number
  monthlySales: number
  totalOrders: number
  totalCustomers: number
}

export interface StoreFilters {
  page: number
  limit: number
  sortBy: 'name' | 'createdAt' | 'status' | 'totalSales'
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: 'pending' | 'approved' | 'rejected' | 'inactive'
  city?: string
}

export interface CreateStoreData {
  name: string
  address: string
  phone: string
  email: string
  manager: string
  managerEmail: string
  description?: string
  city: string
  country: string
  postalCode: string
}

export interface UpdateStoreData extends Partial<CreateStoreData> {
  id: string
  status?: 'pending' | 'approved' | 'rejected' | 'inactive'
}
