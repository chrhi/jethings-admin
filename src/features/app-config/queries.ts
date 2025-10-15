import { apiClient } from '@/lib/api-client'
import { 
  AppConfig, 
  CreateAppConfigRequest, 
  UpdateAppConfigRequest,
  PaginatedAppConfigResponse,
  AppConfigResponse,
  CreateAppConfigDto,
  UpdateAppConfigDto
} from './types'

export const appConfigQueries = {
  // Fetch app configuration - gets first item from paginated list
  fetchAppConfig: async (): Promise<AppConfig | null> => {
    try {
      const response = await apiClient.get<PaginatedAppConfigResponse>('/app-config?page=1&limit=1')
      
      console.log('API Response:', response) // Debug log to see actual structure
      console.log('Response type:', typeof response)
      console.log('Response keys:', response ? Object.keys(response) : 'response is null/undefined')
      
      // Handle different possible response structures
      let appConfigArray: any[] = []
      
      if (response) {
        // Check if response has appConfig array
        if (response.appConfig && Array.isArray(response.appConfig)) {
          appConfigArray = response.appConfig
        }
        // Check if response is directly an array
        else if (Array.isArray(response)) {
          appConfigArray = response
        }
        // Check if response has data property
        else if (response.data && Array.isArray(response.data)) {
          appConfigArray = response.data
        }
        // Check if response has results property
        else if (response.results && Array.isArray(response.results)) {
          appConfigArray = response.results
        }
      }
      
      console.log('AppConfig array:', appConfigArray)
      
      // Return the first item if it exists, otherwise null
      if (appConfigArray && appConfigArray.length > 0) {
        const apiConfig = appConfigArray[0]
        console.log('First config item:', apiConfig)
        
        // Map camelCase API response to frontend format
        return {
          id: apiConfig.id,
          minVersion: apiConfig.minVersion || apiConfig.min_version,
          currentVersion: apiConfig.currentVersion || apiConfig.current_version,
          releaseNotes: apiConfig.releaseNotes || apiConfig.release_notes || '',
          isActive: apiConfig.isActive !== undefined ? apiConfig.isActive : apiConfig.is_active,
          createdAt: apiConfig.createdAt || apiConfig.created_at,
          updatedAt: apiConfig.updatedAt || apiConfig.updated_at,
        }
      }
      
      console.log('No app config found, returning null')
      return null
    } catch (error) {
      console.error('Error fetching app config:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  },
}

export const appConfigMutations = {
  // Create app configuration
  createAppConfig: async (data: CreateAppConfigRequest): Promise<AppConfig> => {
    try {
      const createData: CreateAppConfigDto = {
        minVersion: data.min_version,
        currentVersion: data.current_version,
        releaseNotes: data.release_notes,
        isActive: data.is_active ?? true,
      }

      const response = await apiClient.post<AppConfigResponse>('/app-config', createData)
      // Map camelCase API response to frontend format
      return {
        id: response.id,
        minVersion: response.minVersion,
        currentVersion: response.currentVersion,
        releaseNotes: response.releaseNotes,
        isActive: response.isActive,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }
    } catch (error) {
      console.error('Error creating app config:', error)
      throw error
    }
  },

  // Update app configuration
  updateAppConfig: async (id: string, data: UpdateAppConfigRequest): Promise<AppConfig> => {
    try {
      const updateData: UpdateAppConfigDto = {
        minVersion: data.min_version,
        currentVersion: data.current_version,
        releaseNotes: data.release_notes,
        isActive: data.is_active,
      }

      const response = await apiClient.put<AppConfigResponse>(`/app-config/${id}`, updateData)
      // Map camelCase API response to frontend format
      return {
        id: response.id,
        minVersion: response.minVersion,
        currentVersion: response.currentVersion,
        releaseNotes: response.releaseNotes,
        isActive: response.isActive,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }
    } catch (error) {
      console.error('Error updating app config:', error)
      throw error
    }
  }
}
