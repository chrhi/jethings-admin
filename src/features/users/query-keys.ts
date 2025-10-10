import { UserFilters } from './types'

export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    stats: () => [...queryKeys.users.all, 'stats'] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
    admins: () => [...queryKeys.users.all, 'admins'] as const,
  },
} as const
