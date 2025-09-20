export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions: string[];
  isActive?: boolean;
}

export interface UpdateRoleData extends Partial<CreateRoleData> {
  id: string;
}

export interface RoleFilters {
  page: number;
  limit: number;
  sortBy: 'name' | 'createdAt' | 'userCount';
  sortOrder: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
}

export const PERMISSIONS = [
  { id: 'users.read', label: 'View Users', description: 'Can view user information' },
  { id: 'users.create', label: 'Create Users', description: 'Can create new users' },
  { id: 'users.update', label: 'Update Users', description: 'Can update user information' },
  { id: 'users.delete', label: 'Delete Users', description: 'Can delete users' },
  { id: 'roles.read', label: 'View Roles', description: 'Can view role information' },
  { id: 'roles.create', label: 'Create Roles', description: 'Can create new roles' },
  { id: 'roles.update', label: 'Update Roles', description: 'Can update role information' },
  { id: 'roles.delete', label: 'Delete Roles', description: 'Can delete roles' },
  { id: 'dashboard.read', label: 'View Dashboard', description: 'Can access dashboard' },
  { id: 'settings.read', label: 'View Settings', description: 'Can view system settings' },
  { id: 'settings.update', label: 'Update Settings', description: 'Can update system settings' },
  { id: 'reports.read', label: 'View Reports', description: 'Can view system reports' },
] as const;

export type Permission = typeof PERMISSIONS[number];
