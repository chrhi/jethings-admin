"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { ConfirmationProvider } from "@/contexts/confirmation-context";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";
import { ErrorBoundary } from "./error-boundary";
import { AccessAwareErrorBoundary } from "./access-aware-error-boundary";
import { NetworkStatusBanner } from "./network-status-banner";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            // Add error handling
            throwOnError: false,
          },
          mutations: {
            // Add error handling
            throwOnError: false,
          },
        },
      })
  );

  return (
    <AccessAwareErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <AuthProvider>
            <ConfirmationProvider>
              <NetworkStatusBanner />
              {children}
              <ConfirmationModal />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </ConfirmationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AccessAwareErrorBoundary>
  );
}