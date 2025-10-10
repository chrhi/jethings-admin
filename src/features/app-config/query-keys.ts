export const queryKeys = {
  appConfig: {
    all: ['app-config'] as const,
    config: () => [...queryKeys.appConfig.all, 'config'] as const,
  }
}
