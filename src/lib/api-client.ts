"use client"

import { getCookie, removeCookie, setCookie } from './cookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev'


if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API Client] Base URL:', API_BASE_URL)
}

function redirectToSignin() {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname
    if (currentPath.startsWith('/signin') || currentPath.startsWith('/auth')) return
    localStorage.removeItem('user_data')
    removeCookie('accessToken')
    removeCookie('refreshToken')
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

  private async makeRequest<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { retryCount = 0, ...fetchOptions } = options
    const targetUrl = `${API_BASE_URL}${endpoint}`

    console.log(`[API Client] ${fetchOptions.method || 'GET'} ${targetUrl}`)

 
    const accessToken = getCookie('accessToken')
    const refreshToken = getCookie('refreshToken')



    console.log("these are the access token and refrehtokens" , accessToken ,refreshToken , document?.cookie)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    }


  headers['Authorization'] = `Bearer ${accessToken}`
  headers['x-refresh-token'] = refreshToken ?? ""


    console.log("these are the headers we are sending to the server")
    console.log(headers)

    try {
      const response = await fetch(targetUrl, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      })

      console.log(`[API Client] Response: ${response.status} ${response.statusText}`)

      // Handle token refresh
      if (response.headers.get('x-token-refreshed') === 'true') {
        const newAccessToken = response.headers.get('x-new-access-token')
        const newRefreshToken = response.headers.get('x-new-refresh-token')

        if (newAccessToken) {
          setCookie('accessToken', newAccessToken, 7) // 7 days for access token
          // Verify it was stored
          const verifyAccessToken = getCookie('accessToken')
          console.log('[API Client] ✅ New access token stored', verifyAccessToken ? '✓ Verified' : '✗ Failed to verify')
        }
        if (newRefreshToken) {
          setCookie('refreshToken', newRefreshToken, 30) // 30 days for refresh token
          // Verify it was stored
          const verifyRefreshToken = getCookie('refreshToken')
          console.log('[API Client] ✅ New refresh token stored', verifyRefreshToken ? '✓ Verified' : '✗ Failed to verify')
          console.log('[API Client] Refresh token value matches:', verifyRefreshToken === newRefreshToken ? '✓ Yes' : '✗ No')
        }

        console.log('[API Client] Tokens refreshed and stored successfully.')
      }

      if (!response.ok) {
        let errorData: any
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({ message: 'An error occurred' }))
        } else {
          const textError = await response.text().catch(() => 'An error occurred')
          errorData = { message: textError }
        }

        console.error('[API Client] Error response:', { status: response.status, errorData })

        if (response.status === 401 && !endpoint.startsWith('/auth/')) {
          redirectToSignin()
          throw new Error('Session expired. Please sign in again.')
        }

        if (response.status === 403) throw new Error('ACCESS_DENIED')

        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      } else {
        const text = await response.text()
        return (text ? JSON.parse(text) : {}) as T
      }
    } catch (error) {
      console.error('[API Client] Request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined })
  }

  async put<T>(endpoint: string, body?: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined })
  }

  async patch<T>(endpoint: string, body?: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined })
  }

  async delete<T>(endpoint: string, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = ApiClient.getInstance()
