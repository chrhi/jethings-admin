import { Policy, CreatePolicyRequest, UpdatePolicyRequest, PolicyFilters, PolicyResponse } from '@/features/policies/types'

const API_BASE_URL = ''

class PolicyService {
  private static instance: PolicyService;

  private constructor() {}

  public static getInstance(): PolicyService {
    if (!PolicyService.instance) {
      PolicyService.instance = new PolicyService();
    }
    return PolicyService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401 && retryCount < 1) {
          // Token might be expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });
              
              if (refreshResponse.ok) {
                const { token: newToken } = await refreshResponse.json();
                localStorage.setItem('token', newToken);
                // Retry the original request
                return this.makeRequest(endpoint, options, retryCount + 1);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Policy Management Endpoints
  async getPolicies(filters: PolicyFilters = {}): Promise<PolicyResponse> {
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

    return this.makeRequest<PolicyResponse>(`/api/policies?${params}`);
  }

  async getPolicyById(id: string): Promise<Policy> {
    return this.makeRequest<Policy>(`/api/policies/${id}`);
  }

  async getPoliciesByResource(resourceId: string): Promise<Policy[]> {
    return this.makeRequest<Policy[]>(`/api/policies/by-resource/${resourceId}`);
  }

  async getPoliciesByAction(actionId: string): Promise<Policy[]> {
    return this.makeRequest<Policy[]>(`/api/policies/by-action/${actionId}`);
  }

  async createPolicy(data: CreatePolicyRequest): Promise<Policy> {
    return this.makeRequest<Policy>('/api/policies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePolicy(id: string, data: UpdatePolicyRequest): Promise<Policy> {
    return this.makeRequest<Policy>(`/api/policies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePolicy(id: string): Promise<void> {
    return this.makeRequest<void>(`/api/policies/${id}`, {
      method: 'DELETE',
    });
  }
}

export const policyService = PolicyService.getInstance();
