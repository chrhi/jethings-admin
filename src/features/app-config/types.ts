export interface AppConfig {
  id: string
  minVersion: string
  currentVersion: string
  releaseNotes: string
  isActive: boolean
  createdAt: string
  updatedAt: string
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

// API Response Types
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedAppConfigResponse {
  appConfig: AppConfig[]
  pagination: PaginationInfo
}

export interface AppConfigResponse extends AppConfig {}

export interface CreateAppConfigDto {
  minVersion: string
  currentVersion: string
  releaseNotes?: string
  isActive?: boolean
}

export interface UpdateAppConfigDto {
  minVersion?: string
  currentVersion?: string
  releaseNotes?: string
  isActive?: boolean
}