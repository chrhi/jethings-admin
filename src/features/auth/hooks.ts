import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authQueries } from './queries'
import { authMutations } from './mutations'
import { authQueryKeys } from './query-keys'
import { SignInData, ForgotPasswordData, VerifyPasswordResetData, AcceptInvitationData } from './types'
import toast from 'react-hot-toast'


export const useAuthCheck = () => {
  return useQuery({
    queryKey: authQueryKeys.check(),
    queryFn: authQueries.checkAuth,
    retry: false,
    staleTime: 0, 
  })
}

export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: authQueries.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, 
    enabled,
  })
}

// Mutation hooks
export const useSignInMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authMutations.signIn,
    onSuccess: (data) => {
     
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
     
      queryClient.clear()
      toast.success('Déconnexion réussie!')
    },
    onError: (error: Error) => {
  
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
