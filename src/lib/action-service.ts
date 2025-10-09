import { 
  Action, 
  ActionFilters, 
  ActionResponse, 
  CreateActionRequest, 
  UpdateActionRequest 
} from '@/features/actions/types';

// Use local API routes to avoid CORS issues
const API_BASE_URL = '';

class ActionService {
  private static instance: ActionService;

  private constructor() {}

  public static getInstance(): ActionService {
    if (!ActionService.instance) {
      ActionService.instance = new ActionService();
    }
    return ActionService.instance;
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

  // Action Management Endpoints
  async getActions(filters: ActionFilters = {}): Promise<ActionResponse> {
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

    return this.makeRequest<ActionResponse>(`/api/actions?${params}`);
  }

  async getActionById(id: string): Promise<Action> {
    return this.makeRequest<Action>(`/api/actions/${id}`);
  }

  async createAction(data: CreateActionRequest): Promise<Action> {
    return this.makeRequest<Action>('/api/actions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAction(id: string, data: UpdateActionRequest): Promise<Action> {
    return this.makeRequest<Action>(`/api/actions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAction(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/actions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const actionService = ActionService.getInstance();
