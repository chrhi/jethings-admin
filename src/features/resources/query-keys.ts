export const queryKeys = {
  resources: {
    all: ['resources'] as const,
    lists: () => [...queryKeys.resources.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.resources.lists(), filters] as const,
    details: () => [...queryKeys.resources.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.resources.details(), id] as const,
  }
}
