"use client";

import React from "react";
import { AccessDeniedAlert } from "@/components/access-denied-alert";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  isAccessDenied?: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class AccessAwareErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const isAccessDenied = error.message === 'ACCESS_DENIED' || 
                          error.message.includes('access denied') ||
                          error.message.includes('permission denied') ||
                          error.message.includes('forbidden');
    
    return { 
      hasError: true, 
      error,
      isAccessDenied
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Access Aware Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isAccessDenied) {
        return (
          <AccessDeniedAlert
            title="Access Denied"
            description="You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
            onRetry={() => {
              this.setState({ hasError: false, error: undefined, isAccessDenied: false });
              window.location.reload();
            }}
          />
        );
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback to regular error display for non-access errors
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: undefined, isAccessDenied: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
