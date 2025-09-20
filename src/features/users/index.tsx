// Core components
export { columns } from "./columns"
export { DataTable } from "./table"

// Types
export * from "./types"

// UI Components
export { UserFiltersComponent } from "./components/user-filters"
export { UserStatsComponent, RoleDistributionStats } from "./components/user-stats"
export { PaginationComponent } from "./components/pagination"

// Re-export for convenience
export { useUsers, useUserStats, useCurrentUser, useUserActions } from "@/hooks/use-users"
export { userService } from "@/lib/user-service"