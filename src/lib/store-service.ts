import { Store, StoreStats, CreateStoreData, UpdateStoreData, StoreFilters } from '@/features/stores/types'

// Mock data
const mockStores: Store[] = [
  {
    id: '1',
    name: 'Magasin Central',
    address: '123 Rue de la Paix',
    phone: '+33 1 23 45 67 89',
    email: 'central@jethings.com',
    status: 'approved',
    manager: 'Jean Dupont',
    managerEmail: 'jean.dupont@jethings.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    description: 'Magasin principal situé au cœur de Paris',
    city: 'Paris',
    country: 'France',
    postalCode: '75001',
    totalSales: 125000,
    monthlySales: 15000,
    totalOrders: 1250,
    customerCount: 850
  },
  {
    id: '2',
    name: 'Magasin Nord',
    address: '456 Avenue du Nord',
    phone: '+33 3 20 12 34 56',
    email: 'nord@jethings.com',
    status: 'pending',
    manager: 'Marie Martin',
    managerEmail: 'marie.martin@jethings.com',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    description: 'Nouveau magasin dans le nord de la France',
    city: 'Lille',
    country: 'France',
    postalCode: '59000',
    totalSales: 0,
    monthlySales: 0,
    totalOrders: 0,
    customerCount: 0
  },
  {
    id: '3',
    name: 'Magasin Sud',
    address: '789 Boulevard du Sud',
    phone: '+33 4 91 23 45 67',
    email: 'sud@jethings.com',
    status: 'rejected',
    manager: 'Pierre Durand',
    managerEmail: 'pierre.durand@jethings.com',
    createdAt: '2024-01-30T09:15:00Z',
    updatedAt: '2024-02-01T16:45:00Z',
    description: 'Magasin fermé pour non-conformité',
    city: 'Marseille',
    country: 'France',
    postalCode: '13001',
    totalSales: 0,
    monthlySales: 0,
    totalOrders: 0,
    customerCount: 0
  },
  {
    id: '4',
    name: 'Magasin Ouest',
    address: '321 Rue de l\'Ouest',
    phone: '+33 2 40 12 34 56',
    email: 'ouest@jethings.com',
    status: 'inactive',
    manager: 'Sophie Bernard',
    managerEmail: 'sophie.bernard@jethings.com',
    createdAt: '2024-01-10T11:20:00Z',
    updatedAt: '2024-02-15T13:30:00Z',
    description: 'Magasin temporairement fermé pour rénovation',
    city: 'Nantes',
    country: 'France',
    postalCode: '44000',
    totalSales: 45000,
    monthlySales: 0,
    totalOrders: 320,
    customerCount: 180
  },
  {
    id: '5',
    name: 'Magasin Est',
    address: '654 Avenue de l\'Est',
    phone: '+33 3 83 12 34 56',
    email: 'est@jethings.com',
    status: 'approved',
    manager: 'Thomas Moreau',
    managerEmail: 'thomas.moreau@jethings.com',
    createdAt: '2024-02-05T08:45:00Z',
    updatedAt: '2024-02-05T08:45:00Z',
    description: 'Magasin moderne avec technologies avancées',
    city: 'Strasbourg',
    country: 'France',
    postalCode: '67000',
    totalSales: 78000,
    monthlySales: 12000,
    totalOrders: 650,
    customerCount: 420
  }
]

export const storeService = {
  async getStores(filters: StoreFilters): Promise<{ stores: Store[], total: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredStores = [...mockStores]
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(searchLower) ||
        store.city.toLowerCase().includes(searchLower) ||
        store.manager.toLowerCase().includes(searchLower) ||
        store.email.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply status filter
    if (filters.status) {
      filteredStores = filteredStores.filter(store => store.status === filters.status)
    }
    
    // Apply city filter
    if (filters.city) {
      filteredStores = filteredStores.filter(store => 
        store.city.toLowerCase().includes(filters.city!.toLowerCase())
      )
    }
    
    // Apply sorting
    filteredStores.sort((a, b) => {
      const aValue = a[filters.sortBy]
      const bValue = b[filters.sortBy]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filters.sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
      
      return 0
    })
    
    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit
    const endIndex = startIndex + filters.limit
    const paginatedStores = filteredStores.slice(startIndex, endIndex)
    
    return {
      stores: paginatedStores,
      total: filteredStores.length
    }
  },

  async getStoreStats(): Promise<StoreStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const totalStores = mockStores.length
    const activeStores = mockStores.filter(store => store.status === 'approved').length
    const pendingStores = mockStores.filter(store => store.status === 'pending').length
    const rejectedStores = mockStores.filter(store => store.status === 'rejected').length
    
    const totalSales = mockStores.reduce((sum, store) => sum + (store.totalSales || 0), 0)
    const monthlySales = mockStores.reduce((sum, store) => sum + (store.monthlySales || 0), 0)
    const totalOrders = mockStores.reduce((sum, store) => sum + (store.totalOrders || 0), 0)
    const totalCustomers = mockStores.reduce((sum, store) => sum + (store.customerCount || 0), 0)
    
    return {
      totalStores,
      activeStores,
      pendingStores,
      rejectedStores,
      totalSales,
      monthlySales,
      totalOrders,
      totalCustomers
    }
  },

  async createStore(data: CreateStoreData): Promise<Store> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newStore: Store = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSales: 0,
      monthlySales: 0,
      totalOrders: 0,
      customerCount: 0
    }
    
    mockStores.push(newStore)
    return newStore
  },

  async updateStore(data: UpdateStoreData): Promise<Store> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const storeIndex = mockStores.findIndex(store => store.id === data.id)
    if (storeIndex === -1) {
      throw new Error('Store not found')
    }
    
    const updatedStore = {
      ...mockStores[storeIndex],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    mockStores[storeIndex] = updatedStore
    return updatedStore
  },

  async deleteStore(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const storeIndex = mockStores.findIndex(store => store.id === id)
    if (storeIndex === -1) {
      throw new Error('Store not found')
    }
    
    mockStores.splice(storeIndex, 1)
  }
}
