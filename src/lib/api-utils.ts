import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jethings-backend.fly.dev'

// Helper function to get tokens from request cookies
export function getTokensFromRequest(request: NextRequest): { accessToken: string | null; refreshToken: string | null } {
  return {
    accessToken: request.cookies.get('accessToken')?.value || null,
    refreshToken: request.cookies.get('refreshToken')?.value || null
  }
}

// Helper function to set tokens in response cookies
export function setTokensInResponse(response: NextResponse, accessToken: string, refreshToken: string): NextResponse {
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 // 15 minutes
  })
  
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
  
  return response
}

// Helper function to clear tokens from response cookies
export function clearTokensInResponse(response: NextResponse): NextResponse {
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

// Main API request helper with token management
export async function makeApiRequest<T>(
  endpoint: string,
  request: NextRequest,
  options: RequestInit = {},
  retryCount = 0
): Promise<NextResponse<T>> {
  const { accessToken, refreshToken } = getTokensFromRequest(request)
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }
  
  // Add authorization headers if tokens exist
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  if (refreshToken) {
    headers['x-refresh-token'] = refreshToken
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
    
    // Check if tokens were refreshed by the backend
    const tokenRefreshed = response.headers.get('x-token-refreshed') === 'true'
    const newAccessToken = response.headers.get('x-new-access-token')
    const newRefreshToken = response.headers.get('x-new-refresh-token')
    
    // Create NextResponse from the backend response
    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
    
    // If tokens were refreshed, set them in cookies
    if (tokenRefreshed && newAccessToken && newRefreshToken) {
      setTokensInResponse(nextResponse, newAccessToken, newRefreshToken)
    }
    
    // Handle 401 errors with token refresh
    if (!response.ok && response.status === 401 && retryCount === 0) {
      try {
        console.log('Access token expired, attempting to refresh...')
        
        // Try to refresh token
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(refreshToken && { 'x-refresh-token': refreshToken }),
          },
        })
        
        if (refreshResponse.ok) {
          console.log('Token refreshed successfully, retrying request...')
          
          // Get new tokens from refresh response
          const refreshedTokenRefreshed = refreshResponse.headers.get('x-token-refreshed') === 'true'
          const refreshedNewAccessToken = refreshResponse.headers.get('x-new-access-token')
          const refreshedNewRefreshToken = refreshResponse.headers.get('x-new-refresh-token')
          
          // Update headers with new tokens
          if (refreshedNewAccessToken) {
            headers['Authorization'] = `Bearer ${refreshedNewAccessToken}`
          }
          if (refreshedNewRefreshToken) {
            headers['x-refresh-token'] = refreshedNewRefreshToken
          }
          
          // Retry the original request
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          })
          
          // Create NextResponse for retry
          const retryNextResponse = new NextResponse(retryResponse.body, {
            status: retryResponse.status,
            statusText: retryResponse.statusText,
            headers: retryResponse.headers,
          })
          
          // Set refreshed tokens in retry response
          if (refreshedTokenRefreshed && refreshedNewAccessToken && refreshedNewRefreshToken) {
            setTokensInResponse(retryNextResponse, refreshedNewAccessToken, refreshedNewRefreshToken)
          }
          
          return retryNextResponse
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError)
        // If refresh fails, clear tokens and return 401
        const errorResponse = NextResponse.json(
          { message: 'Authentication failed' },
          { status: 401 }
        )
        clearTokensInResponse(errorResponse)
        return errorResponse
      }
    }
    
    return nextResponse
  } catch (error) {
    console.error('API request failed:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
