// Core components
export { createColumns } from "./columns"
export { DataTable } from "./table"

// Types
export * from "./types"
export * from "./user-role-types"

// UI Components
export { UserFiltersComponent } from "./components/user-filters"
export { UserStatsComponent, RoleDistributionStats } from "./components/user-stats"
export { PaginationComponent } from "./components/pagination"
export { UserRoleModal } from "./components/user-role-modal"

// Hooks
export * from "./user-role-hooks"

// Re-export for convenience
export { useUsers, useUserStats, useCurrentUser, useUserActions } from "@/hooks/use-users"
export { userService } from "@/lib/user-service"