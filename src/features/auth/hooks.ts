import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authQueries } from './queries'
import { authMutations } from './mutations'
import { authQueryKeys } from './query-keys'
import { SignInData, ForgotPasswordData, VerifyPasswordResetData, AcceptInvitationData } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useAuthCheck = () => {
  return useQuery({
    queryKey: authQueryKeys.check(),
    queryFn: authQueries.checkAuth,
    retry: false,
    staleTime: 0, // Always fresh
  })
}

export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: authQueries.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled, // Allow disabling the query
  })
}

// Mutation hooks
export const useSignInMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authMutations.signIn,
    onSuccess: (data) => {
      // Invalidate and refetch auth-related queries
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user)
      
      toast.success('Connexion réussie!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur de connexion')
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authMutations.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      toast.success('Déconnexion réussie!')
    },
    onError: (error: Error) => {
      // Even if logout fails, clear local state
      queryClient.clear()
      toast.error(error.message || 'Erreur lors de la déconnexion')
    },
  })
}

export const useRefreshTokenMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authMutations.refreshToken,
    onSuccess: (data) => {
      // Update current user data
      queryClient.setQueryData(authQueryKeys.currentUser(), data.user)
    },
    onError: (error: Error) => {
      // If refresh fails, clear all data
      queryClient.clear()
      localStorage.removeItem('user_data')
    },
  })
}

export const useRequestPasswordResetMutation = () => {
  return useMutation({
    mutationFn: authMutations.requestPasswordReset,
    onSuccess: () => {
      toast.success('Email de réinitialisation envoyé!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l\'envoi de l\'email')
    },
  })
}

export const useVerifyPasswordResetMutation = () => {
  return useMutation({
    mutationFn: authMutations.verifyPasswordReset,
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la réinitialisation')
    },
  })
}

export const useAcceptInvitationMutation = () => {
  return useMutation({
    mutationFn: authMutations.acceptInvitation,
    onSuccess: () => {
      toast.success('Compte créé avec succès!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du compte')
    },
  })
}
