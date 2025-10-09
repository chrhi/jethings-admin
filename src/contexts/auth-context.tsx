"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, SignInData, ForgotPasswordData, VerifyPasswordResetData } from '@/lib/auth-service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  requestPasswordReset: (data: ForgotPasswordData) => Promise<void>;
  verifyPasswordReset: (data: VerifyPasswordResetData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const initializeAuth = async () => {
      try {
        // First check if user is authenticated (this now validates tokens)
        const isAuth = await authService.isAuthenticated();
        console.log('Authentication check result:', isAuth);
        
        if (!isAuth) {
          console.log('User not authenticated');
          setUser(null);
          authService.clearStoredUser();
          setIsLoading(false);
          return;
        }

        // Check for stored user data first
        const storedUser = authService.getStoredUser();
        if (storedUser) {
          console.log('Found stored user:', storedUser);
          setUser(storedUser);
          setIsLoading(false);
          return;
        }

        // Try to get current user data from server
        // This will now automatically refresh tokens if needed
        console.log('No stored user, fetching from server...');
        const currentUser = await authService.getCurrentUser();
        console.log('Got current user from server:', currentUser);
        setUser(currentUser);
        authService.setStoredUser(currentUser);
      } catch (error) {
        console.log('Failed to initialize auth:', error);
        // Only clear stored data if it's a definitive auth failure
        // Don't clear on network errors or temporary issues
        if (error instanceof Error && error.message.includes('Authentication failed')) {
          authService.clearStoredUser();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Proactive token refresh to prevent expiration during active sessions
  useEffect(() => {
    if (!user) return;

    // Refresh token every 12 minutes (before 15min expiration)
    const refreshInterval = setInterval(async () => {
      try {
        console.log('Proactive token refresh...');
        await authService.refreshAccessToken();
        console.log('Proactive token refresh successful');
      } catch (error) {
        console.log('Proactive token refresh failed:', error);
        // If refresh fails, clear user and redirect to signin
        setUser(null);
        authService.clearStoredUser();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      }
    }, 12 * 60 * 1000); // 12 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [user]);

  const signIn = async (data: SignInData) => {
    try {
      console.log('Auth context: Starting sign in');
      const response = await authService.signIn(data);
      console.log('Auth context: Sign in successful, setting user:', response.user);
      setUser(response.user);
      authService.setStoredUser(response.user);
      console.log('Auth context: User set successfully');
    } catch (error) {
      console.error('Auth context: Sign in error:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (data: ForgotPasswordData) => {
    try {
      await authService.requestPasswordReset(data);
    } catch (error) {
      throw error;
    }
  };

  const verifyPasswordReset = async (data: VerifyPasswordResetData) => {
    try {
      await authService.verifyPasswordReset(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Auth context: Starting logout');
      await authService.logout();
      console.log('Auth context: Logout API call successful');
      setUser(null);
      authService.clearStoredUser();
      console.log('Auth context: User state cleared');
    } catch (error) {
      console.error('Auth context: Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      authService.clearStoredUser();
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshAccessToken();
      setUser(response.user);
      authService.setStoredUser(response.user);
    } catch (error) {
      // If refresh fails, user needs to sign in again
      setUser(null);
      authService.clearStoredUser();
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      authService.setStoredUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      authService.clearStoredUser();
      return null;
    }
  };

  // For client-side components that need to know auth status
  // This is mainly used for UI state, not for protection
  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super_admin') || false;
  const isSuperAdmin = user?.roles?.includes('super_admin') || false;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    requestPasswordReset,
    verifyPasswordReset,
    logout,
    refreshToken,
    getCurrentUser,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
