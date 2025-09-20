"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, SignInData, ForgotPasswordData, VerifyPasswordResetData } from '@/lib/auth';
import { userService } from '@/lib/user-service';

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
    // Authentication is handled by middleware on the server side
    // This context is mainly for managing user state after sign-in
    setIsLoading(false);
  }, []);

  const signIn = async (data: SignInData) => {
    try {
      const response = await authService.signIn(data);
      setUser(response.user);
    } catch (error) {
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
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshAccessToken();
      setUser(response.user);
    } catch (error) {
      // If refresh fails, user needs to sign in again
      setUser(null);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
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
