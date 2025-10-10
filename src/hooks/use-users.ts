/**
 * @deprecated This file is deprecated. Use React Query hooks from @/features/users/hooks instead.
 * 
 * The new implementation provides:
 * - Better caching with React Query
 * - Direct API calls to backend (no Next.js API route proxy)
 * - Automatic loading/error states
 * - Optimistic updates
 * - Better TypeScript inference
 * 
 * Migration guide:
 * - useUsers() → useUsersQuery()
 * - useUserStats() → useUserStatsQuery()
 * - useCurrentUser() → useCurrentUserQuery()
 * - useUserActions() → useUpdateUserMutation(), useDeactivateUserMutation(), etc.
 */

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/lib/user-service';
import { User, UserFilters, UserStats, UsersResponse, UserUpdateData } from '@/features/users/types';

export const useUsers = (filters: UserFilters = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUsers(filters);
      setUsers(data?.users || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]); // Reset to empty array on error
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, pagination, refetch: fetchUsers };
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserStats();
      // Ensure the data has the expected structure with fallbacks
      const normalizedStats: UserStats = {
        totalUsers: data?.totalUsers || 0,
        activeUsers: data?.activeUsers || 0,
        verifiedUsers: data?.verifiedUsers || 0,
        usersByRole: data?.usersByRole || {}
      };
      setStats(normalizedStats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
      // Set fallback stats on error
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        usersByRole: {}
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return { user, loading, error, refetch: fetchCurrentUser };
};

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (id: string, data: UserUpdateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(id, data);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.deactivateUser(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.activateUser(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.deleteUser(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
  };
};
