/**
 * @deprecated This file is deprecated. Use React Query hooks from @/features/users/hooks instead.
 * 
 * The new implementation provides:
 * - Direct API calls to backend (no Next.js API route proxy)
 * - Better error handling with React Query
 * - Automatic caching and cache invalidation
 * - Optimistic updates
 * 
 * Migration guide:
 * - userService.getUsers() → useUsersQuery()
 * - userService.getUserStats() → useUserStatsQuery()
 * - userService.updateUser() → useUpdateUserMutation()
 * - userService.deleteUser() → useDeleteUserMutation()
 * - etc.
 */

import { 
  User, 
  UserFilters, 
  UserStats, 
  UsersResponse, 
  UserUpdateData, 
  CreateAdminData, 
  AdminResponse, 
  UserActionResponse 
} from '@/features/users/types';

// Use local API routes to avoid CORS issues
const API_BASE_URL = '';

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // If it's a 401 error and we haven't retried yet, try to refresh the token
        if (response.status === 401 && retryCount === 0) {
          try {
            console.log('Access token expired, attempting to refresh...')
            await fetch('/api/auth/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            })
            console.log('Token refreshed successfully, retrying request...')
            // Retry the request once with the new token
            return this.makeRequest<T>(endpoint, options, retryCount + 1)
          } catch (refreshError) {
            console.log('Token refresh failed:', refreshError)
            // If refresh fails, clear stored user and redirect to signin
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user_data')
              window.location.href = '/signin'
            }
          }
        }

        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(errorData.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  // User Management Endpoints
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    return this.makeRequest<UsersResponse>(`/api/users?${params}`);
  }

  async getUserStats(): Promise<UserStats> {
    return this.makeRequest<UserStats>('/api/users/stats');
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/api/users/me');
  }

  async getUserById(id: string): Promise<User> {
    return this.makeRequest<User>(`/api/users/${id}`);
  }

  async updateCurrentUser(data: UserUpdateData): Promise<User> {
    return this.makeRequest<User>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UserUpdateData): Promise<User> {
    return this.makeRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deactivateUser(id: string): Promise<UserActionResponse> {
    return this.makeRequest<UserActionResponse>(`/api/users/${id}/deactivate`, {
      method: 'POST',
    });
  }

  async activateUser(id: string): Promise<UserActionResponse> {
    return this.makeRequest<UserActionResponse>(`/api/users/${id}/activate`, {
      method: 'POST',
    });
  }

  async deleteUser(id: string): Promise<UserActionResponse> {
    return this.makeRequest<UserActionResponse>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Management Endpoints
  async getAdmins(): Promise<User[]> {
    return this.makeRequest<User[]>('/api/users/admins');
  }

  async createAdmin(data: CreateAdminData): Promise<AdminResponse> {
    return this.makeRequest<AdminResponse>('/api/users/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAdmin(id: string): Promise<UserActionResponse> {
    return this.makeRequest<UserActionResponse>(`/api/users/admins/${id}`, {
      method: 'DELETE',
    });
  }

  async blockAdmin(id: string): Promise<UserActionResponse> {
    return this.makeRequest<UserActionResponse>(`/api/users/admins/${id}/block`, {
      method: 'POST',
    });
  }

  async unblockAdmin(id: string): Promise<UserActionResponse> {
    return this.makeRequest<UserActionResponse>(`/api/users/admins/${id}/unblock`, {
      method: 'POST',
    });
  }
}

export const userService = UserService.getInstance();
