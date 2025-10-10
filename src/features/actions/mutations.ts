import { apiClient } from '@/lib/api-client'
import { 
  Action, 
  CreateActionRequest, 
  UpdateActionRequest 
} from './types'

export const actionsMutations = {
  // Create action
  createAction: async (data: CreateActionRequest): Promise<Action> => {
    return apiClient.post<Action>('/actions', data)
  },

  // Update action
  updateAction: async (id: string, data: UpdateActionRequest): Promise<Action> => {
    return apiClient.patch<Action>(`/actions/${id}`, data)
  },

  // Delete action
  deleteAction: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/actions/${id}`)
  },
}
