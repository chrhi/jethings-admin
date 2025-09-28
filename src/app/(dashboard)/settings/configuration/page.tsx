"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Settings, Smartphone, AlertCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { AppConfig } from "@/types/app-config"

export default function ConfigurationPage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [config, setConfig] = useState<AppConfig>({
    id: "",
    min_version: "",
    current_version: "",
    release_notes: "",
    is_active: true,
    created_at: "",
    updated_at: ""
  })

  // Fetch existing configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/app-config')
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.error('Error fetching config:', error)
        toast.error("Impossible de charger la configuration existante.")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const method = config.id ? 'PUT' : 'POST'
      const response = await fetch('/api/app-config', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          min_version: config.min_version,
          current_version: config.current_version,
          release_notes: config.release_notes,
          is_active: config.is_active
        }),
      })

      if (response.ok) {
        const updatedConfig = await response.json()
        setConfig(updatedConfig)
        toast.success("Configuration mise à jour avec succès")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save configuration')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AppConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration de l'application</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de version et de configuration de l'application mobile.
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuration de l'application</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de version et de configuration de l'application mobile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="space-y-2">
                <Label htmlFor="min_version">Version minimale *</Label>
                <Input
                  id="min_version"
                  placeholder="1.0.0"
                  value={config.min_version}
                  onChange={(e) => handleInputChange('min_version', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Version minimale requise pour utiliser l'application
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_version">Version actuelle *</Label>
                <Input
                  id="current_version"
                  placeholder="1.2.0"
                  value={config.current_version}
                  onChange={(e) => handleInputChange('current_version', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Dernière version disponible de l'application
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="release_notes">Notes de version</Label>
              <Textarea
                id="release_notes"
                placeholder="Décrivez les nouvelles fonctionnalités et améliorations..."
                value={config.release_notes}
                onChange={(e) => handleInputChange('release_notes', e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Informations sur les nouveautés et corrections de bugs
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Configuration active</Label>
                <p className="text-sm text-muted-foreground">
                  Activez cette configuration pour qu'elle soit utilisée par l'application
                </p>
              </div>
              <Switch
                checked={config.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
            </div>
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
                <p className="text-sm">{config.id || "Non défini"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Statut:</span>
                <p className="text-sm">
                  {config.is_active ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Créée le:</span>
                <p className="text-sm">{config.created_at || "Non défini"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Modifiée le:</span>
                <p className="text-sm">{config.updated_at || "Non défini"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {loading ? "Sauvegarde..." : "Sauvegarder la configuration"}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Les modifications prendront effet immédiatement</span>
          </div>
        </div>
      </form>
    </div>
  )
}
