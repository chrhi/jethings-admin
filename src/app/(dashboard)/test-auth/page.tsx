"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, refreshToken } = useAuth();
  const router = useRouter();

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      alert("Token refreshed successfully!");
    } catch (error) {
      alert("Token refresh failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
          <CardDescription>
            This page tests the authentication system functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Authentication Status:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
            
            <div>
              <strong>Loading State:</strong>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isLoading ? 'Loading' : 'Not Loading'}
              </span>
            </div>
          </div>

          {user && (
            <div className="space-y-2">
              <h3 className="font-semibold">User Information:</h3>
              <div className="bg-gray-50 p-4 rounded-md space-y-1">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={handleRefreshToken} variant="outline">
              Test Token Refresh
            </Button>
            <LogoutButton variant="destructive" />
          </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">Available Actions:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Sign in with valid credentials</li>
            <li>• Test forgot password flow</li>
            <li>• Test token refresh functionality</li>
            <li>• Test logout functionality</li>
            <li>• Navigate to protected routes (/, /admins, /users)</li>
          </ul>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
