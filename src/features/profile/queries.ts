// Mock data - replace with actual database calls
let currentUser: UserProfile | null = {
  id: "user_1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  age: 30,
  description: "Software developer with 5+ years of experience",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  isActive: true,
  isEmailVerified: true,
  roles: ["admin"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastActivity: new Date().toISOString()
}

export const profileQueries = {
  // Fetch current user profile
  fetchCurrentUser: async (): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (!currentUser) {
      throw new Error("User not found")
    }
    
    return currentUser
  },
}

export const profileMutations = {
  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (!currentUser) {
      throw new Error("User not found")
    }

    // Update profile
    const updatedProfile: UserProfile = {
      ...currentUser,
      ...data,
      updatedAt: new Date().toISOString()
    }

    currentUser = updatedProfile
    return updatedProfile
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    if (!currentUser) {
      throw new Error("User not found")
    }

    // In a real app, this would validate the current password and update it
    // For now, just simulate success
    if (data.currentPassword === "wrong") {
      throw new Error("Current password is incorrect")
    }
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (!currentUser) {
      throw new Error("User not found")
    }

    // In a real app, this would delete the user account
    // For now, just simulate success
    currentUser = null
  }
}
