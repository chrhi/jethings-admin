"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Zap, Code } from "lucide-react"
import { Policy } from "../types"

interface PolicySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy: Policy | null
}

export function PolicySheet({
  open,
  onOpenChange,
  policy,
}: PolicySheetProps) {
  if (!policy) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[800px] sm:max-w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold">Policy Details</div>
              <div className="text-sm text-muted-foreground font-mono">{policy.resource.code} + {policy.action.code}</div>
            </div>
          </SheetTitle>
          <SheetDescription>
            Manage policy rules and configurations for "{policy.resource.name}" resource with "{policy.action.name}" action
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4">
          {/* Policy Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Information</CardTitle>
              <CardDescription>
                Basic information about this policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={policy.isActive ? "default" : "secondary"}>
                      {policy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(policy.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {policy.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{policy.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resource Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Resource Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="font-medium font-mono text-sm">{policy.resource.code}</div>
                  <div className="text-sm text-muted-foreground">{policy.resource.name}</div>
                </div>
              </div>
              {policy.resource.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{policy.resource.description}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">Status:</label>
                <Badge variant={policy.resource.isActive ? "default" : "secondary"}>
                  {policy.resource.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Action Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-sm bg-muted flex items-center justify-center border">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="font-medium font-mono text-sm">{policy.action.code}</div>
                  <div className="text-sm text-muted-foreground">{policy.action.name}</div>
                </div>
              </div>
              {policy.action.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{policy.action.description}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">Status:</label>
                <Badge variant={policy.action.isActive ? "default" : "secondary"}>
                  {policy.action.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Condition Expression */}
          {policy.conditionExpression && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Condition Expression</span>
                </CardTitle>
                <CardDescription>
                  The conditional logic that determines when this policy applies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm font-mono">{policy.conditionExpression}</code>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Placeholder for Future Features */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Management</CardTitle>
              <CardDescription>
                Advanced policy configuration and rule management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced policy rules, subjects, and conditions management will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
