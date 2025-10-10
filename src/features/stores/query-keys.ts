export const queryKeys = {
  stores: {
    all: ['stores'] as const,
    lists: () => [...queryKeys.stores.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.stores.lists(), filters] as const,
    details: () => [...queryKeys.stores.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.stores.details(), id] as const,
    my: () => [...queryKeys.stores.all, 'my'] as const,
  }
}
