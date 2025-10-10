export const queryKeys = {
  profile: {
    all: ['profile'] as const,
    currentUser: () => [...queryKeys.profile.all, 'current-user'] as const,
  }
}
