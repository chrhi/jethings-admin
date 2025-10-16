"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AccessDeniedAlertProps {
  title?: string;
  description?: string;
  showActions?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function AccessDeniedAlert({
  title = "Access Denied",
  description = "You don't have permission to access this resource.",
  showActions = true,
  onRetry,
  className = "",
}: AccessDeniedAlertProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}>
      <Card className="w-full max-w-md border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Shield className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-amber-900 dark:text-amber-100">
            {title}
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Contact your administrator if you believe this is an error.
            </AlertDescription>
          </Alert>

          {showActions && (
            <div className="flex flex-col gap-2">
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => router.back()}
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Compact version for inline use
export function AccessDeniedInline({
  message = "You don't have permission to access this resource.",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <Alert className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 ${className}`}>
      <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        {message}
      </AlertDescription>
    </Alert>
  );
}
