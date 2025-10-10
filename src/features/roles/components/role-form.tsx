"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Role, CreateRoleRequest, UpdateRoleRequest } from "../types"

const roleSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(50, "Code must be at most 50 characters")
    .regex(/^[a-z0-9_-]+$/, "Code must contain only lowercase letters, numbers, underscores, and hyphens"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  isActive: z.boolean().default(true),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleFormProps {
  role?: Role
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => void
  onCancel: () => void
  loading?: boolean
}

export function RoleForm({ role, onSubmit, onCancel, loading = false }: RoleFormProps) {
  const [isActive, setIsActive] = useState(role?.isActive ?? true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      code: role?.code || "",
      name: role?.name || "",
      description: role?.description || "",
      isActive: role?.isActive ?? true,
    },
  })

  const handleFormSubmit = (data: RoleFormData) => {
    const submitData = {
      ...data,
      isActive,
    }
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>
            {role ? "Update the role information below." : "Enter the role details below."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                {...register("code")}
                placeholder="e.g., store_manager"
                disabled={loading}
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Lowercase letters, numbers, underscores, and hyphens only
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Store Manager"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Optional description of the role"
              rows={3}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Whether this role is active and can be assigned
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : role ? "Update Role" : "Create Role"}
        </Button>
      </div>
    </form>
  )
}
