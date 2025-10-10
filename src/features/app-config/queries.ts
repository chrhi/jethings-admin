// Mock data - replace with actual database calls
let appConfig: AppConfig | null = {
  id: "config_1",
  min_version: "1.0.0",
  current_version: "1.2.0",
  release_notes: "Nouvelles fonctionnalités et corrections de bugs",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const appConfigQueries = {
  // Fetch app configuration
  fetchAppConfig: async (): Promise<AppConfig> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!appConfig) {
      throw new Error("Configuration non trouvée")
    }
    
    return appConfig
  },
}

export const appConfigMutations = {
  // Create or update app configuration
  createOrUpdateAppConfig: async (data: CreateAppConfigRequest): Promise<AppConfig> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Validate required fields
    if (!data.min_version || !data.current_version) {
      throw new Error("Les champs min_version et current_version sont requis")
    }

    // Validate version format (basic validation)
    const versionRegex = /^\d+\.\d+\.\d+$/
    if (!versionRegex.test(data.min_version) || !versionRegex.test(data.current_version)) {
      throw new Error("Format de version invalide. Utilisez le format X.Y.Z")
    }

    // Create or update configuration
    const now = new Date().toISOString()
    const newConfig: AppConfig = {
      id: appConfig?.id || `config_${Date.now()}`,
      min_version: data.min_version,
      current_version: data.current_version,
      release_notes: data.release_notes || "",
      is_active: data.is_active ?? true,
      created_at: appConfig?.created_at || now,
      updated_at: now
    }

    appConfig = newConfig
    return newConfig
  },

  // Update app configuration
  updateAppConfig: async (data: UpdateAppConfigRequest): Promise<AppConfig> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (!appConfig) {
      throw new Error("Configuration non trouvée")
    }

    // Validate version format if provided
    if (data.min_version && !/^\d+\.\d+\.\d+$/.test(data.min_version)) {
      throw new Error("Format de version invalide pour min_version. Utilisez le format X.Y.Z")
    }

    if (data.current_version && !/^\d+\.\d+\.\d+$/.test(data.current_version)) {
      throw new Error("Format de version invalide pour current_version. Utilisez le format X.Y.Z")
    }

    // Update configuration
    const updatedConfig: AppConfig = {
      ...appConfig,
      ...data,
      updated_at: new Date().toISOString()
    }

    appConfig = updatedConfig
    return updatedConfig
  }
}
