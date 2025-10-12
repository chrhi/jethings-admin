import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appConfigQueries } from './queries'
import { appConfigMutations } from './queries' // mutations are in the same file
import { queryKeys } from './query-keys'
import { CreateAppConfigRequest, UpdateAppConfigRequest } from './types'
import toast from 'react-hot-toast'

// Query hooks
export const useAppConfigQuery = () => {
  return useQuery({
    queryKey: queryKeys.appConfig.config(),
    queryFn: appConfigQueries.fetchAppConfig,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })
}

// Mutation hooks
export const useCreateAppConfigMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: appConfigMutations.createAppConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.appConfig.config(), data)
      toast.success('Configuration créée avec succès')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création')
    },
  })
}

export const useUpdateAppConfigMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppConfigRequest }) => 
      appConfigMutations.updateAppConfig(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.appConfig.config(), data)
      toast.success('Configuration mise à jour avec succès')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    },
  })
}
