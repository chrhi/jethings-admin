import { apiClient } from '@/lib/api-client'
import { 
  Action, 
  ActionFilters, 
  ActionResponse 
} from './types'

export const actionsQueries = {
  // Fetch actions with filters
  fetchActions: async (filters: ActionFilters = {}): Promise<ActionResponse> => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v))
        } else {
          params.append(key, String(value))
        }
      }
    })

    return apiClient.get<ActionResponse>(`/actions?${params}`)
  },

  // Fetch action by ID
  fetchActionById: async (id: string): Promise<Action> => {
    return apiClient.get<Action>(`/actions/${id}`)
  },
}
