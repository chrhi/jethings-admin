export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  phoneNumber?: string;
  avatarUrl?: string;
  description?: string;
  roles?: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export interface UserFilters {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: string[];
  isEmailVerified?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  usersByRole: {
    [key: string]: number;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  avatarUrl?: string;
  description?: string;
  roles?: string[];
  isEmailVerified?: boolean;
  isActive?: boolean;
}

export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  age?: number;
  description?: string;
  roles?: string[];
}

export interface AdminResponse {
  message: string;
  admin?: User;
}

export interface UserActionResponse {
  message: string;
}

// Legacy Payment type for backward compatibility
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
