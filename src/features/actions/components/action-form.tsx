"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Action } from "../types"

const actionSchema = z.object({
  code: z.string().min(1, "Code is required").max(50, "Code must be less than 50 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  isActive: z.boolean(),
})

type ActionFormData = z.infer<typeof actionSchema>

interface ActionFormProps {
  action?: Action
  onSubmit: (data: ActionFormData) => void
  onCancel: () => void
  loading?: boolean
}

export function ActionForm({ 
  action, 
  onSubmit, 
  onCancel, 
  loading = false,
}: ActionFormProps) {
  const form = useForm({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      code: action?.code || "",
      name: action?.name || "",
      description: action?.description || "",
      isActive: action?.isActive ?? true,
    },
  })

  const handleSubmit = (data: ActionFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., create" 
                    {...field}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>
                  Unique identifier for the action (lowercase, no spaces)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Create" {...field} />
                </FormControl>
                <FormDescription>
                  Human-readable name for the action
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter action description (optional)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of what this action represents
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
                  Make this action available for role assignments
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
            {loading ? "Saving..." : action ? "Update Action" : "Create Action"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
