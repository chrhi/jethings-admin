const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev'


function getTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null }
  }
  
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  return {
    accessToken,
    refreshToken
  }
}


function redirectToSignin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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
    const { accessToken, refreshToken } = getTokens()
    
    console.log('🔍 Debug - Tokens retrieved:', { 
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
      endpoint 
    })
    
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers as Record<string, string>,
    }
    
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    if (refreshToken) {
      headers['x-refresh-token'] = refreshToken
    }
    
 
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      })
      
      console.log('🔍 Debug - Response status:', response.status, 'for', endpoint)
      
  
      if (!response.ok && response.status === 401 && retryCount === 0) {
        try {
        
       
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(refreshToken && { 'x-refresh-token': refreshToken }),
            },
            credentials: 'include',
          })
          
        
          if (refreshResponse.ok) {
            console.log('Token refreshed successfully, retrying request...')
            
         
            const refreshData = await refreshResponse.json()
            
       
            if (refreshData.accessToken) {
              localStorage.setItem('accessToken', refreshData.accessToken)
            }
            if (refreshData.refreshToken) {
              localStorage.setItem('refreshToken', refreshData.refreshToken)
            }
            
            console.log('🔍 Debug - New tokens saved to localStorage')
            
        
            return this.makeRequest<T>(endpoint, {
              ...options,
              retryCount: retryCount + 1,
            })
          }
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError)
          redirectToSignin()
          throw new Error('Authentication failed')
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }))
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
