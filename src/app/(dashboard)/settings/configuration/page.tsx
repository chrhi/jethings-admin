"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Breadcrumb, useBreadcrumbs } from "@/components/ui/breadcrumb"
import { Save, Settings, Smartphone, AlertCircle, Loader2, AlertTriangle } from "lucide-react"
import { usePathname } from "next/navigation"
import { ConfigurationSkeleton } from "./_components/configuration-skeleton"
import { useAppConfigQuery, useCreateAppConfigMutation, useUpdateAppConfigMutation } from "@/features/app-config"
import { CreateAppConfigRequest } from "@/features/app-config/types"

const configSchema = z.object({
  minVersion: z.string().min(1, "La version minimale est requise"),
  currentVersion: z.string().min(1, "La version actuelle est requise"),
  releaseNotes: z.string().optional(),
  isActive: z.boolean(),
})

type ConfigFormValues = z.infer<typeof configSchema>

export default function ConfigurationPage() {
  const pathname = usePathname()
  const breadcrumbs = useBreadcrumbs(pathname)


  const { data: config, isLoading } = useAppConfigQuery()
  const createMutation = useCreateAppConfigMutation()
  const updateMutation = useUpdateAppConfigMutation()

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    mode: "onChange",
    defaultValues: {
      minVersion: "",
      currentVersion: "",
      releaseNotes: "",
      isActive: true,
    },
  })

  // Determine if we're creating or updating
  const isCreating = !config
  const mutation = isCreating ? createMutation : updateMutation


  useEffect(() => {
    if (config) {
      form.reset({
        minVersion: config.minVersion,
        currentVersion: config.currentVersion,
        releaseNotes: config.releaseNotes || "",
        isActive: config.isActive,
      })
    }
  }, [config, form])

  const onSubmit = (data: ConfigFormValues) => {
    const requestData: CreateAppConfigRequest = {
      min_version: data.minVersion,
      current_version: data.currentVersion,
      release_notes: data.releaseNotes,
      is_active: data.isActive,
    }

    if (isCreating) {
      createMutation.mutate(requestData)
    } else {
      updateMutation.mutate({ 
        id: config!.id, 
        data: requestData 
      })
    }
  }

  if (isLoading) {
    return <ConfigurationSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold tracking-tight">Configuration de l'application</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de version et de configuration de l'application mobile.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={mutation.isPending || !form.formState.isValid}
              className="flex items-center gap-2"
              size="lg"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {mutation.isPending ? "Sauvegarde..." : isCreating ? "Créer la configuration" : "Mettre à jour la configuration"}
            </Button>
          </div>

          {/* Validation feedback */}
          {!form.formState.isValid && form.formState.isDirty && (
            <Alert variant="destructive" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez remplir tous les champs obligatoires
              </AlertDescription>
            </Alert>
          )}

          {/* Warning Alert */}
          <Alert variant="warning" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Les modifications prendront effet immédiatement
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres de version
              </CardTitle>
              <CardDescription>
                Configurez les versions minimales et actuelles de l'application mobile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version minimale *</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0.0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Version minimale requise pour utiliser l'application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version actuelle *</FormLabel>
                      <FormControl>
                        <Input placeholder="1.2.0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dernière version disponible de l'application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="releaseNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes de version</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez les nouvelles fonctionnalités et améliorations..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Informations sur les nouveautés et corrections de bugs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Configuration active</FormLabel>
                      <FormDescription>
                        Activez cette configuration pour qu'elle soit utilisée par l'application
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Informations de l'application
              </CardTitle>
              <CardDescription>
                Détails sur la configuration actuelle de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">ID de configuration:</span>
                  <p className="text-sm">{config?.id || "Non défini"}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Statut:</span>
                  <p className="text-sm">
                    {config?.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Créée le:</span>
                  <p className="text-sm">{config?.created_at || "Non défini"}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Modifiée le:</span>
                  <p className="text-sm">{config?.updated_at || "Non défini"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  )
}