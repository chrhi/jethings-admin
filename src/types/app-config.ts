export interface AppConfig {
  id: string
  min_version: string
  current_version: string
  release_notes: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateAppConfigRequest {
  min_version: string
  current_version: string
  release_notes?: string
  is_active?: boolean
}

export interface UpdateAppConfigRequest {
  min_version?: string
  current_version?: string
  release_notes?: string
  is_active?: boolean
}
