"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, SignInData, ForgotPasswordData, VerifyPasswordResetData, AcceptInvitationData } from '@/features/auth/types';
import { 
  useCurrentUser, 
  useSignInMutation, 
  useLogoutMutation, 
  useRequestPasswordResetMutation,
  useVerifyPasswordResetMutation,
  useAcceptInvitationMutation
} from '@/features/auth/hooks';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  requestPasswordReset: (data: ForgotPasswordData) => Promise<void>;
  verifyPasswordReset: (data: VerifyPasswordResetData) => Promise<void>;
  acceptInvitation: (data: AcceptInvitationData) => Promise<void>;
  logout: () => Promise<void>;
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

  // Check if we're on an auth page (client-side only)
  const isAuthPage = typeof window !== 'undefined' && 
                     (window.location.pathname.startsWith('/signin') || 
                      window.location.pathname.startsWith('/auth') ||
                      window.location.pathname.startsWith('/accept-invitation'));

  // React Query hooks - disable useCurrentUser on auth pages to prevent 401 loops
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser(!isAuthPage);
  const signInMutation = useSignInMutation();
  const logoutMutation = useLogoutMutation();
  const requestPasswordResetMutation = useRequestPasswordResetMutation();
  const verifyPasswordResetMutation = useVerifyPasswordResetMutation();
  const acceptInvitationMutation = useAcceptInvitationMutation();

  // Update user state when currentUser query changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
    } else if (userError) {
      setUser(null);
      setIsLoading(false);
    } else if (!userLoading) {
      setIsLoading(false);
    }
  }, [currentUser, userError, userLoading]);

  // Check for stored user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser && !currentUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, [currentUser]);

  const signIn = async (data: SignInData) => {
    try {
      console.log('Auth context: Starting sign in');
      await signInMutation.mutateAsync(data);
      console.log('Auth context: Sign in successful');
    } catch (error) {
      console.error('Auth context: Sign in error:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (data: ForgotPasswordData) => {
    try {
      await requestPasswordResetMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const verifyPasswordReset = async (data: VerifyPasswordResetData) => {
    try {
      await verifyPasswordResetMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const acceptInvitation = async (data: AcceptInvitationData) => {
    try {
      await acceptInvitationMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Auth context: Starting logout');
      await logoutMutation.mutateAsync();
      console.log('Auth context: Logout successful');
      setUser(null);
    } catch (error) {
      console.error('Auth context: Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      if (currentUser) {
        return currentUser;
      }
      return null;
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
    acceptInvitation,
    logout,
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
