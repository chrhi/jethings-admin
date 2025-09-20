# User Management Feature

This feature provides comprehensive user management functionality for the admin dashboard, including user listing, filtering, statistics, and admin management.

## Features

### User Management
- **User Listing**: Display users in a paginated table with sorting and filtering
- **User Statistics**: Show total users, active users, verified users, and role distribution
- **Advanced Filtering**: Filter by name, email, phone, role, verification status, and activity status
- **User Actions**: View, edit, activate/deactivate, and delete users
- **Pagination**: Navigate through large user lists efficiently

### Admin Management
- **Admin Listing**: View all administrators and super administrators
- **Admin Statistics**: Track admin counts and activity
- **Admin Actions**: Create, update, and manage admin accounts

## Components

### Core Components
- `UserFiltersComponent`: Advanced filtering interface with search, role filters, and status filters
- `UserStatsComponent`: Display user statistics and metrics
- `RoleDistributionStats`: Visual representation of user distribution by role
- `PaginationComponent`: Pagination controls for large datasets
- `DataTable`: Enhanced table component with loading states and sorting

### Table Columns
- **Name**: User's full name with avatar
- **Role**: User roles with color-coded badges
- **Phone**: Contact information
- **Verified**: Email verification status
- **Status**: Account active/inactive status
- **Last Activity**: When user was last active
- **Created**: Account creation date
- **Actions**: Dropdown menu with user actions

## API Integration

### User Service (`src/lib/user-service.ts`)
Provides methods for all user-related API calls:
- `getUsers(filters)`: Fetch users with filtering and pagination
- `getUserStats()`: Get user statistics
- `getCurrentUser()`: Get current user profile
- `updateUser(id, data)`: Update user information
- `deactivateUser(id)`: Deactivate user account
- `activateUser(id)`: Activate user account
- `deleteUser(id)`: Delete user account

### Admin Service Methods
- `getAdmins()`: Fetch all administrators
- `createAdmin(data)`: Create new admin account
- `deleteAdmin(id)`: Delete admin account
- `blockAdmin(id)`: Block admin account
- `unblockAdmin(id)`: Unblock admin account

## Hooks

### `useUsers(filters)`
Custom hook for managing user data:
```typescript
const { users, loading, error, pagination, refetch } = useUsers(filters)
```

### `useUserStats()`
Hook for user statistics:
```typescript
const { stats, loading, error, refetch } = useUserStats()
```

### `useUserActions()`
Hook for user management actions:
```typescript
const { updateUser, deactivateUser, activateUser, deleteUser } = useUserActions()
```

## Types

### User Interface
```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  age?: number
  phoneNumber?: string
  avatarUrl?: string
  description?: string
  roles: string[]
  isEmailVerified: boolean
  isActive: boolean
  lastActivity?: string
  createdAt: string
  updatedAt: string
  isAdmin?: boolean
  isSuperAdmin?: boolean
}
```

### Filter Interface
```typescript
interface UserFilters {
  search?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  roles?: string[]
  isEmailVerified?: boolean
  isActive?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

## Usage

### Basic User Listing
```typescript
import { useUsers } from '@/hooks/use-users'

function UsersPage() {
  const { users, loading, error } = useUsers()
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {users.map(user => (
        <div key={user.id}>{user.firstName} {user.lastName}</div>
      ))}
    </div>
  )
}
```

### With Filtering
```typescript
import { useUsers } from '@/hooks/use-users'
import { UserFilters } from '@/features/users/types'

function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    search: 'john',
    roles: ['admin'],
    isActive: true,
    page: 1,
    limit: 10
  })
  
  const { users, loading, pagination } = useUsers(filters)
  
  return (
    <div>
      {/* Your UI components */}
    </div>
  )
}
```

## Pages

### Users Page (`/users`)
- Complete user management interface
- Statistics dashboard
- Advanced filtering
- User table with actions
- Pagination controls

### Admins Page (`/admins`)
- Admin-specific management
- Admin statistics
- Admin creation and management
- Role-based filtering

## Authentication & Authorization

The user management feature integrates with the auth context to provide:
- Role-based access control
- Admin/super admin permissions
- Current user information
- Authentication state management

## Styling

The components use Tailwind CSS with a consistent design system:
- Color-coded badges for roles and status
- Responsive grid layouts
- Loading states and skeletons
- Hover effects and transitions
- Accessible form controls

## Dependencies

- `@tanstack/react-table`: Table functionality
- `@radix-ui/react-dropdown-menu`: Dropdown menus
- `@radix-ui/react-select`: Select components
- `date-fns`: Date formatting
- `lucide-react`: Icons
- `class-variance-authority`: Component variants

## Future Enhancements

- User creation modal
- Bulk user actions
- User export functionality
- Advanced search with filters
- User activity tracking
- Role management interface
- User profile editing modal
- Email verification management
