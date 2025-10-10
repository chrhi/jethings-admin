import { apiClient } from '@/lib/api-client'
import { 
  User, 
  UserUpdateData, 
  CreateAdminData, 
  AdminResponse, 
  UserActionResponse 
} from './types'

export const usersMutations = {
  // Update current user
  updateCurrentUser: async (data: UserUpdateData): Promise<User> => {
    return apiClient.put<User>('/users/me', data)
  },

  // Update user by ID
  updateUser: async ({ id, data }: { id: string; data: UserUpdateData }): Promise<User> => {
    return apiClient.put<User>(`/users/${id}`, data)
  },

  // Deactivate user
  deactivateUser: async (id: string): Promise<UserActionResponse> => {
    return apiClient.post<UserActionResponse>(`/users/${id}/deactivate`)
  },

  // Activate user
  activateUser: async (id: string): Promise<UserActionResponse> => {
    return apiClient.post<UserActionResponse>(`/users/${id}/activate`)
  },

  // Delete user
  deleteUser: async (id: string): Promise<UserActionResponse> => {
    return apiClient.delete<UserActionResponse>(`/users/${id}`)
  },

  // Create admin
  createAdmin: async (data: CreateAdminData): Promise<AdminResponse> => {
    return apiClient.post<AdminResponse>('/users/admins', data)
  },

  // Delete admin
  deleteAdmin: async (id: string): Promise<UserActionResponse> => {
    return apiClient.delete<UserActionResponse>(`/users/admins/${id}`)
  },

  // Block admin
  blockAdmin: async (id: string): Promise<UserActionResponse> => {
    return apiClient.post<UserActionResponse>(`/users/admins/${id}/block`)
  },

  // Unblock admin
  unblockAdmin: async (id: string): Promise<UserActionResponse> => {
    return apiClient.post<UserActionResponse>(`/users/admins/${id}/unblock`)
  },
}
