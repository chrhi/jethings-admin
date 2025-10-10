"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Policy, Resource, Action } from "../types"
import { useResourcesQuery } from "@/features/resources/hooks"
import { useActionsQuery } from "@/features/actions/hooks"

const policySchema = z.object({
  resourceId: z.string().min(1, "Resource is required"),
  actionId: z.string().min(1, "Action is required"),
  conditionExpression: z.string().optional(),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  isActive: z.boolean(),
})

type PolicyFormData = z.infer<typeof policySchema>

interface PolicyFormProps {
  policy?: Policy
  onSubmit: (data: PolicyFormData) => void
  onCancel: () => void
  loading?: boolean
}

export function PolicyForm({ 
  policy, 
  onSubmit, 
  onCancel, 
  loading = false,
}: PolicyFormProps) {
  // Use React Query to fetch resources and actions
  const { data: resourcesData, isLoading: loadingResources } = useResourcesQuery({ 
    page: 1, 
    limit: 100 
  })
  const { data: actionsData, isLoading: loadingActions } = useActionsQuery({ 
    page: 1, 
    limit: 100 
  })
  
  const resources = resourcesData?.data || []
  const actions = actionsData?.data || []

  const form = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      resourceId: policy?.resourceId || "",
      actionId: policy?.actionId || "",
      conditionExpression: policy?.conditionExpression || "",
      description: policy?.description || "",
      isActive: policy?.isActive ?? true,
    },
  })


  const handleSubmit = (data: PolicyFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="resourceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || loadingResources}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resource" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm">{resource.code}</span>
                          <span className="text-xs text-muted-foreground">{resource.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the resource this policy applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || loadingActions}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {actions.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm">{action.code}</span>
                          <span className="text-xs text-muted-foreground">{action.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the action this policy allows/denies
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="conditionExpression"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition Expression</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., user.store_id = resource.store_id"
                  className="resize-none font-mono"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional conditional expression for this policy
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter policy description (optional)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of what this policy represents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-sm border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Active Status
                </FormLabel>
                <FormDescription>
                  Make this policy available for use
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : policy ? "Update Policy" : "Create Policy"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
