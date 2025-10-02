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

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
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
    return apiRequest<AuthResponse>('/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({}), // The refresh token is in httpOnly cookies
    })
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data')
    }
  },

  // Check if token needs refresh (not applicable with httpOnly cookies)
  needsRefresh(): boolean {
    return false // Handled by server-side middleware
  }
}
