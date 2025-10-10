"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, Shield, Zap, Code, Edit, Trash2, Clock, Calendar } from "lucide-react"
import { Policy } from "../types"
import { usePolicies } from "@/hooks/use-policies"
import toast from "react-hot-toast"

interface PolicySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy: Policy | null
  onEdit?: (policy: Policy) => void
  onDelete?: (policy: Policy) => void
}

export function PolicySheet({
  open,
  onOpenChange,
  policy,
  onEdit,
  onDelete,
}: PolicySheetProps) {
  const { updatePolicy } = usePolicies()
  const [isUpdating, setIsUpdating] = useState(false)
  const [localPolicy, setLocalPolicy] = useState<Policy | null>(policy)

  // Update local state when policy prop changes
  if (policy && policy.id !== localPolicy?.id) {
    setLocalPolicy(policy)
  }

  if (!localPolicy) return null

  const handleToggleStatus = async () => {
    setIsUpdating(true)
    try {
      await updatePolicy(localPolicy.id, {
        isActive: !localPolicy.isActive,
      })
      setLocalPolicy({ ...localPolicy, isActive: !localPolicy.isActive })
      toast.success(`Policy has been ${!localPolicy.isActive ? "activated" : "deactivated"} successfully.`)
    } catch (error) {
      toast.error("Failed to update policy status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(localPolicy)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(localPolicy)
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[900px] sm:max-w-[900px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">Policy Details</div>
                <div className="text-sm text-muted-foreground font-mono">{localPolicy.resource.code} + {localPolicy.action.code}</div>
              </div>
            </SheetTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <SheetDescription>
            Manage policy rules and configurations for "{localPolicy.resource.name}" resource with "{localPolicy.action.name}" action
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4 pb-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Quickly manage policy status and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="policy-status">Policy Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {localPolicy.isActive ? "Policy is currently active and enforced" : "Policy is currently inactive"}
                  </p>
                </div>
                <Switch
                  id="policy-status"
                  checked={localPolicy.isActive}
                  onCheckedChange={handleToggleStatus}
                  disabled={isUpdating}
                />
              </div>
            </CardContent>
          </Card>

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
                    <Badge variant={localPolicy.isActive ? "default" : "secondary"}>
                      {localPolicy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Policy ID</label>
                  <p className="text-sm font-mono">{localPolicy.id}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm">{new Date(localPolicy.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{new Date(localPolicy.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {localPolicy.description && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1">{localPolicy.description}</p>
                  </div>
                </>
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
                  <div className="font-medium font-mono text-sm">{localPolicy.resource.code}</div>
                  <div className="text-sm text-muted-foreground">{localPolicy.resource.name}</div>
                </div>
              </div>
              {localPolicy.resource.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{localPolicy.resource.description}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">Status:</label>
                <Badge variant={localPolicy.resource.isActive ? "default" : "secondary"}>
                  {localPolicy.resource.isActive ? "Active" : "Inactive"}
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
                  <div className="font-medium font-mono text-sm">{localPolicy.action.code}</div>
                  <div className="text-sm text-muted-foreground">{localPolicy.action.name}</div>
                </div>
              </div>
              {localPolicy.action.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{localPolicy.action.description}</p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">Status:</label>
                <Badge variant={localPolicy.action.isActive ? "default" : "secondary"}>
                  {localPolicy.action.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Condition Expression */}
          {localPolicy.conditionExpression && (
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
                <div className="bg-muted p-4 rounded-md border">
                  <code className="text-sm font-mono whitespace-pre-wrap break-all">{localPolicy.conditionExpression}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This expression is evaluated at runtime to determine if the policy should be applied to a specific request.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Placeholder for Future Features */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Advanced Policy Management</CardTitle>
              <CardDescription>
                Role assignments, subject rules, and advanced conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-sm">
                  Features like role-based assignments, dynamic subject rules, and complex condition builders will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
