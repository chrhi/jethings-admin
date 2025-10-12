import { UserFilters } from './types'
import { UserRoleFilters } from './user-role-types'

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
  userRoles: {
    all: ['user-roles'] as const,
    lists: () => [...queryKeys.userRoles.all, 'list'] as const,
    list: (filters: UserRoleFilters) => [...queryKeys.userRoles.lists(), filters] as const,
    byUser: (userId: string) => [...queryKeys.userRoles.all, 'by-user', userId] as const,
    byRole: (roleId: string) => [...queryKeys.userRoles.all, 'by-role', roleId] as const,
    detail: (id: string) => [...queryKeys.userRoles.all, 'detail', id] as const,
  },
} as const
