export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  age?: number
  phoneNumber?: string
  avatarUrl?: string
  description?: string
  roles: string[]
  isEmailVerified: boolean
  isActive: boolean
  lastActivity?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  message: string
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface SignInData {
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface VerifyPasswordResetData {
  otp: string
  newPassword: string
}

// Helper function to refresh access token
async function refreshTokenHelper(): Promise<AuthResponse> {
  return fetch('/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Token refresh failed')
    }
    return response.json()
  })
}

// Helper function to clear stored user data
function clearUserData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data')
  }
}

// API request helper with automatic token refresh
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for httpOnly cookies
      ...options,
    })

    if (!response.ok) {
      // If it's a 401 error and we haven't retried yet, try to refresh the token
      if (response.status === 401 && retryCount === 0) {
        try {
          console.log('Access token expired, attempting to refresh...')
          await refreshTokenHelper()
          console.log('Token refreshed successfully, retrying request...')
          // Retry the request once with the new token
          return apiRequest<T>(endpoint, options, retryCount + 1)
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError)
          // If refresh fails, clear stored user and redirect to signin
          clearUserData()
          if (typeof window !== 'undefined') {
            window.location.href = '/signin'
          }
        }
      }

      let errorMessage = 'API request failed'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error occurred')
  }
}

// Authentication API functions using existing API routes
export const authService = {
  // Sign in user
  async signIn(credentials: SignInData): Promise<AuthResponse> {
    console.log('Signing in with:', credentials.email);
    const response = await apiRequest<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('Sign in response:', response);
    return response;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/api/users/me')
  },

  // Refresh access token
  async refreshAccessToken(): Promise<AuthResponse> {
    return refreshTokenHelper()
  },

  // Logout (revoke all tokens)
  async logout(): Promise<{ message: string }> {
    console.log('Auth service: Calling logout API');
    const response = await apiRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
    console.log('Auth service: Logout API response:', response);
    return response;
  },

  // Request password reset
  async requestPasswordReset(data: ForgotPasswordData): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Verify password reset
  async verifyPasswordReset(data: VerifyPasswordResetData): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/api/auth/verify-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      const data = await response.json();
      return data.authenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  },

  // Get stored user data (if available)
  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_data')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          return null
        }
      }
    }
    return null
  },

  // Store user data
  setStoredUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user))
    }
  },

  // Clear stored user data
  clearStoredUser(): void {
    clearUserData()
  },

  // Check if token needs refresh (not applicable with httpOnly cookies)
  needsRefresh(): boolean {
    return false // Handled by server-side middleware
  }
}
