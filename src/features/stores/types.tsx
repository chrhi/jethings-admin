import { Store } from '@/types/store'

// Re-export types from the main types file
export type { 
  Store, 
  StoreStatus, 
  CreateStoreRequest as CreateStoreData,
  UpdateStoreRequest as UpdateStoreData,
  UpdateStoreUserRequest,
  StoreFilters,
  StoreResponse,
  ApiError
} from '@/types/store'

// Additional store-specific types
export interface StoreStats {
  total: number
  pending: number
  accepted: number
  rejected: number
  active: number
  inactive: number
}

export interface StoreWithUser extends Store {
  user?: {
    id: string
    name: string
    email: string
  }
}
