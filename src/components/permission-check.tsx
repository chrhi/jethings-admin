"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { AccessDeniedAlert, AccessDeniedInline } from "@/components/access-denied-alert";
import { Loader2 } from "lucide-react";

interface PermissionCheckProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  showInline?: boolean;
}

export function PermissionCheck({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback,
  showInline = false,
}: PermissionCheckProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      let hasRequiredRole = true;
      let hasRequiredPermission = true;

      // Check roles
      if (requiredRoles.length > 0) {
        hasRequiredRole = requiredRoles.some(role => 
          user.roles?.includes(role) || false
        );
      }

      // Check permissions (if user has permissions array)
      if (requiredPermissions.length > 0 && user.permissions) {
        hasRequiredPermission = requiredPermissions.some(permission =>
          user.permissions?.includes(permission) || false
        );
      }

      setHasPermission(hasRequiredRole && hasRequiredPermission);
    } else if (!isLoading && !isAuthenticated) {
      setHasPermission(false);
    }
  }, [user, isLoading, isAuthenticated, requiredRoles, requiredPermissions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (hasPermission === false) {
    if (showInline) {
      return (
        <AccessDeniedInline 
          message="You don't have permission to access this content."
        />
      );
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <AccessDeniedAlert
        title="Access Denied"
        description="You don't have the required permissions to access this resource."
      />
    );
  }

  if (hasPermission === null) {
    return null;
  }

  return <>{children}</>;
}

// Hook for checking permissions in components
export function usePermissions() {
  const { user, isLoading, isAuthenticated } = useAuth();

  const hasRole = (role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles?.includes(role));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.some(permission => user.permissions?.includes(permission));
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    isAdmin: hasRole('admin') || hasRole('super_admin'),
    isSuperAdmin: hasRole('super_admin'),
  };
}
