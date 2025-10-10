export const queryKeys = {
  actions: {
    all: ['actions'] as const,
    lists: () => [...queryKeys.actions.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.actions.lists(), filters] as const,
    details: () => [...queryKeys.actions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.actions.details(), id] as const,
  }
}
