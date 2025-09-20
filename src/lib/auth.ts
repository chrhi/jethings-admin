// Use local API routes to avoid CORS issues
const API_BASE_URL = '';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  phoneNumber?: string;
  avatarUrl?: string;
  description?: string;
  roles: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyPasswordResetData {
  otp: string;
  newPassword: string;
}

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // Tokens are now stored in HTTP-only cookies, so we can't access them directly
    // We'll need to check authentication status via API calls
    this.accessToken = null;
    this.refreshToken = null;
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }

  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
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

  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  public async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Tokens are now set by the API route via cookies
    // We still need to update our local state
    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;
    return response;
  }

  public async requestPasswordReset(data: ForgotPasswordData): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async verifyPasswordReset(data: VerifyPasswordResetData): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/api/auth/verify-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.makeRequest<AuthResponse>('/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    // Tokens are now set by the API route via cookies
    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;
    return response;
  }

  public async logout(): Promise<{ message: string }> {
    try {
      const response = await this.makeRequest<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      });
      this.clearTokens();
      return response;
    } catch (error) {
      // Clear tokens even if API call fails
      this.clearTokens();
      throw error;
    }
  }

  public async revokeAllTokens(): Promise<{ message: string }> {
    const response = await this.makeRequest<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
    this.clearTokens();
    return response;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    if (typeof window !== 'undefined') {
      // Set access token to expire in 15 minutes (same as JWT expiry)
      this.setCookie('accessToken', accessToken, 0.01); // 15 minutes
      // Set refresh token to expire in 7 days
      this.setCookie('refreshToken', refreshToken, 7);
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      this.deleteCookie('accessToken');
      this.deleteCookie('refreshToken');
    }
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public isAuthenticated(): boolean {
    // Since tokens are in HTTP-only cookies, we can't check them directly
    // We'll need to make an API call to check authentication status
    // For now, we'll assume the user is authenticated if we have tokens in memory
    return !!this.accessToken;
  }

  public async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      // You might need to implement a /me endpoint or decode the JWT
      // For now, we'll return null and let the app handle it
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
