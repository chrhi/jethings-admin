"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react"

export default function ServerError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">500 - Server Error</CardTitle>
          <CardDescription className="text-base">
            Something went wrong on our end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            We're experiencing technical difficulties. Please try again later or contact support if the problem persists.
          </div>
          
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 rounded-md overflow-auto max-h-32">
              <p className="font-mono text-destructive">{error.message}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={reset} 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If this error continues, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
