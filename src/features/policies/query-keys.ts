export const queryKeys = {
  policies: {
    all: ['policies'] as const,
    lists: () => [...queryKeys.policies.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.policies.lists(), filters] as const,
    details: () => [...queryKeys.policies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.policies.details(), id] as const,
    byResource: (resourceId: string) => [...queryKeys.policies.all, 'by-resource', resourceId] as const,
    byAction: (actionId: string) => [...queryKeys.policies.all, 'by-action', actionId] as const,
  }
}
