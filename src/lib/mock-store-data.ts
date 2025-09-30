import { Store, StoreResponse, StoreStats } from '@/types/store'

// Mock store data for development/demo purposes
export const mockStores: Store[] = [
  {
    id: "mock-1",
    userId: "user-1",
    name: "Boutique Électronique",
    description: "Spécialisée dans les appareils électroniques et gadgets",
    icon: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
    status: "accepted",
    isActive: true,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    deletedAt: null
  },
  {
    id: "mock-2", 
    userId: "user-2",
    name: "Mode & Style",
    description: "Vêtements tendance pour tous les âges",
    icon: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center",
    status: "pending",
    isActive: true,
    createdAt: "2024-01-14T09:15:00.000Z",
    updatedAt: "2024-01-14T09:15:00.000Z",
    deletedAt: null
  },
  {
    id: "mock-3",
    userId: "user-3", 
    name: "Librairie du Quartier",
    description: "Livres, magazines et fournitures scolaires",
    icon: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=center",
    status: "accepted",
    isActive: false,
    createdAt: "2024-01-13T14:20:00.000Z",
    updatedAt: "2024-01-13T14:20:00.000Z",
    deletedAt: null
  },
  {
    id: "mock-4",
    userId: "user-4",
    name: "Café Artisanal",
    description: "Café et pâtisseries faites maison",
    icon: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop&crop=center",
    status: "rejected",
    isActive: false,
    createdAt: "2024-01-12T11:45:00.000Z",
    updatedAt: "2024-01-12T11:45:00.000Z",
    deletedAt: null
  }
]

export const mockStoreResponse: StoreResponse = {
  stores: mockStores,
  pagination: {
    page: 1,
    limit: 10,
    total: mockStores.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  }
}

export const mockStoreStats: StoreStats = {
  total: mockStores.length,
  pending: mockStores.filter(s => s.status === 'pending').length,
  accepted: mockStores.filter(s => s.status === 'accepted').length,
  rejected: mockStores.filter(s => s.status === 'rejected').length,
  active: mockStores.filter(s => s.isActive).length,
  inactive: mockStores.filter(s => !s.isActive).length
}
