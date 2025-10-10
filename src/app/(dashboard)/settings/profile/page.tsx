"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, useBreadcrumbs } from "@/components/ui/breadcrumb"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Save, User, Trash2, Shield } from "lucide-react"
import { usePathname } from "next/navigation"
import { format, isValid } from "date-fns"
import { useCurrentUserQuery, useUpdateProfileMutation, useChangePasswordMutation, useDeleteAccountMutation } from "@/features/profile"
import { UpdateProfileRequest, ChangePasswordRequest } from "@/features/profile/types"


const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (!isValid(date)) return 'Invalid Date';
  
  return format(date, "MMM dd, yyyy 'at' HH:mm");
};


const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  age: z.number().optional(),
  description: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const pathname = usePathname()
  const breadcrumbs = useBreadcrumbs(pathname)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  
  const { data: user, isLoading } = useCurrentUserQuery()
  const updateProfileMutation = useUpdateProfileMutation()
  const changePasswordMutation = useChangePasswordMutation()
  const deleteAccountMutation = useDeleteAccountMutation()


  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      age: undefined,
      description: "",
    },
  })

 
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })


  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || "",
        age: user.age,
        description: user.description || "",
      })
    }
  }, [user, profileForm])

  const handleSaveProfile = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data as UpdateProfileRequest)
  }

  const handleChangePassword = (data: PasswordFormValues) => {
    changePasswordMutation.mutate(data as ChangePasswordRequest)
    passwordForm.reset()
  }

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
    setDeleteDialogOpen(false)
  }

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="max-w-4xl space-y-6">
          {/* User Avatar Skeleton */}
          <Card className="rounded-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-sm" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Skeleton */}
          <Card className="rounded-sm">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-9 w-32" />
            </CardContent>
          </Card>

          {/* Account Information Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-sm">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Security Skeleton */}
          <Card className="rounded-sm">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
              <Skeleton className="h-9 w-32" />
            </CardContent>
          </Card>

          {/* Danger Zone Skeleton */}
          <Card className="rounded-sm border-destructive">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-9 w-36" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* User Avatar and Basic Info */}
        <Card className="rounded-sm">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-lg">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex space-x-2">
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={user.isEmailVerified ? "success" : "warning"}>
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  {user.roles?.map((role) => (
                    <Badge 
                      key={role} 
                      variant={role === 'super_admin' ? 'purple' : role === 'admin' ? 'indigo' : 'secondary'}
                    >
                      {role.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={profileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Your age" 
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself..." 
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending || !profileForm.formState.isValid}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm">{user.email}</p>
              </div>
              {user.phoneNumber && (
                <div>
                  <span className="text-sm font-medium">Phone:</span>
                  <p className="text-sm">{user.phoneNumber}</p>
                </div>
              )}
              {user.age && (
                <div>
                  <span className="text-sm font-medium">Age:</span>
                  <p className="text-sm">{user.age} years</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">User ID:</span>
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded-sm">
                  {user.id}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-sm">
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Last Updated:</span>
                <p className="text-sm">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
              {user.lastActivity && (
                <div>
                  <span className="text-sm font-medium">Last Activity:</span>
                  <p className="text-sm">
                    {formatDate(user.lastActivity)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security & Password */}
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security and password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" placeholder="Current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" placeholder="New password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={changePasswordMutation.isPending || !passwordForm.formState.isValid}
                >
                  {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-sm border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setDeleteDialogOpen(true)}
                disabled={deleteAccountMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data."
        onConfirm={handleDeleteAccount}
        confirmText="Delete Account"
        cancelText="Cancel"
        loading={deleteAccountMutation.isPending}
        variant="destructive"
      />
    </div>
  )
}