"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Bell, Shield, Palette, Globe } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences de compte.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et vos préférences de compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Votre prénom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Votre nom" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" placeholder="Parlez-nous de vous..." />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les modifications
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez comment vous souhaitez recevoir les notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des notifications importantes par email
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications push</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des notifications push dans votre navigateur
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications de sécurité</Label>
                <p className="text-sm text-muted-foreground">
                  Alertes pour les activités de sécurité importantes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface utilisateur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Clair</Button>
                <Button variant="outline" size="sm">Sombre</Button>
                <Button variant="outline" size="sm">Système</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Langue</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Français</Button>
                <Button variant="outline" size="sm">English</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Système
            </CardTitle>
            <CardDescription>
              Paramètres système et de sécurité.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Input placeholder="Europe/Paris" />
            </div>
            <div className="space-y-2">
              <Label>Format de date</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">DD/MM/YYYY</Button>
                <Button variant="outline" size="sm">MM/DD/YYYY</Button>
                <Button variant="outline" size="sm">YYYY-MM-DD</Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Changer le mot de passe</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="password" placeholder="Mot de passe actuel" />
                <Input type="password" placeholder="Nouveau mot de passe" />
              </div>
            </div>
            <Button variant="destructive">
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
