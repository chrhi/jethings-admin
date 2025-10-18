const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev'

// Log the API base URL on initialization (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API Client] Base URL:', API_BASE_URL)
}

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
    
    console.log(`[API Client] ${fetchOptions.method || 'GET'} ${endpoint}`)
    
    // Determine if this is an auth endpoint that should go directly to backend
    const isAuthEndpoint = endpoint.startsWith('/auth/signin') || 
                          endpoint.startsWith('/auth/signup') ||
                          endpoint.startsWith('/auth/request-password-reset') ||
                          endpoint.startsWith('/auth/verify-password-reset') ||
                          endpoint.startsWith('/auth/accept-invitation')
    
    const targetUrl = isAuthEndpoint 
      ? `${API_BASE_URL}${endpoint}`
      : `/api/auth/proxy${endpoint}`
    
    console.log(`[API Client] Target URL: ${targetUrl}`)
    console.log(`[API Client] Is auth endpoint: ${isAuthEndpoint}`)
    
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
      
      console.log(`[API Client] Response status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        let errorData: any
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({ message: 'An error occurred' }))
        } else {
          const textError = await response.text().catch(() => 'An error occurred')
          errorData = { message: textError }
        }
        
        console.error(`[API Client] Error response:`, {
          status: response.status,
          statusText: response.statusText,
          errorData,
          endpoint,
        })
        
        // Handle different error status codes
        if (response.status === 401 && !isAuthEndpoint) {
          console.log('[API Client] 401 Unauthorized - redirecting to signin')
          redirectToSignin()
          throw new Error('Session expired. Please sign in again.')
        }
        
        if (response.status === 403) {
          console.log('[API Client] 403 Forbidden - access denied')
          throw new Error('ACCESS_DENIED')
        }
        
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }
      
      // Check if response has content
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      } else {
        // If no JSON content, return empty object
        const text = await response.text()
        return (text ? JSON.parse(text) : {}) as T
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[API Client] Network error:', error)
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.')
      }
      
      console.error('[API Client] Request failed:', error)
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
