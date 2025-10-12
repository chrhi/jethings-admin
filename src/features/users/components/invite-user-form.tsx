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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateInvitationDto } from "../types"
import { useRolesQuery } from "@/features/roles/hooks"

const invitationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  phoneNumber: z
    .string()
    .optional(),
  roleId: z
    .string()
    .min(1, "Role is required")
    .refine((val) => val !== "loading" && val !== "no-roles", {
      message: "Please select a valid role",
    }),
})

type InvitationFormData = z.infer<typeof invitationSchema>

interface InviteUserFormProps {
  onSubmit: (data: CreateInvitationDto) => void
  onCancel: () => void
  loading?: boolean
}

export function InviteUserForm({ onSubmit, onCancel, loading = false }: InviteUserFormProps) {
  const { data: rolesData, isLoading: rolesLoading } = useRolesQuery({})
  const roles = rolesData?.data || []

  const form = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      roleId: "",
    },
  })

  const handleSubmit = (data: InvitationFormData) => {
    const submitData: CreateInvitationDto = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId,
    }
    onSubmit(submitData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter first name" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter last name" 
                    {...field} 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="Enter email address" 
                  {...field} 
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                An invitation will be sent to this email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder="Enter phone number (optional)" 
                  {...field} 
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Optional phone number for the user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rolesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading roles...
                    </SelectItem>
                  ) : roles.length === 0 ? (
                    <SelectItem value="no-roles" disabled>
                      No roles available
                    </SelectItem>
                  ) : (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name} ({role.code})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                The role that will be assigned to the invited user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || rolesLoading || roles.length === 0}>
            {loading ? "Sending Invitation..." : "Send Invitation"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
