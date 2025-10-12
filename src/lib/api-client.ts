const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev'

function redirectToSignin() {
  if (typeof window !== 'undefined') {
    // Don't redirect if we're already on the signin page or auth pages
    const currentPath = window.location.pathname
    if (currentPath.startsWith('/signin') || currentPath.startsWith('/auth')) {
      return
    }
    
    localStorage.removeItem('user_data')
    window.location.href = '/signin'
  }
}

interface ApiClientOptions extends RequestInit {
  retryCount?: number
}

class ApiClient {
  private static instance: ApiClient

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private async makeRequest<T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const { retryCount = 0, ...fetchOptions } = options
    
    console.log('🔍 Debug - Making request to:', endpoint)
    
    // Determine if this is an auth endpoint that should go directly to backend
    const isAuthEndpoint = endpoint.startsWith('/auth/signin') || 
                          endpoint.startsWith('/auth/signup') ||
                          endpoint.startsWith('/auth/request-password-reset') ||
                          endpoint.startsWith('/auth/verify-password-reset')
    
    const targetUrl = isAuthEndpoint 
      ? `${API_BASE_URL}${endpoint}`
      : `/api/auth/proxy${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers as Record<string, string>,
    }
    
    try {
      const response = await fetch(targetUrl, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      })
      
      console.log('🔍 Debug - Response status:', response.status, 'for', endpoint)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }))
        
        // If we get a 401 and it's not an auth endpoint, redirect to signin
        if (response.status === 401 && !isAuthEndpoint) {
          redirectToSignin()
          throw new Error('Authentication failed')
        }
        
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }
      
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.')
      }
      throw error
    }
  }

  async get<T>(endpoint: string, options: Omit<ApiClientOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(endpoint: string, body?: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options: Omit<ApiClientOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = ApiClient.getInstance()
