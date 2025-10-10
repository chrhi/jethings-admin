export const queryKeys = {
  roles: {
    all: ['roles'] as const,
    lists: () => [...queryKeys.roles.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.roles.lists(), filters] as const,
    details: () => [...queryKeys.roles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.roles.details(), id] as const,
  }
}
