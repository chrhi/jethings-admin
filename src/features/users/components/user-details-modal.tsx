"use client"

import { User } from "../types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserDetailsModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
          <DialogDescription>
            Informations complètes sur {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-lg">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex space-x-2">
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Actif" : "Inactif"}
                </Badge>
                <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                  {user.isEmailVerified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Informations de contact</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Email :</span>
                  <p className="text-sm">{user.email}</p>
                </div>
                {user.phoneNumber && (
                  <div>
                    <span className="text-sm font-medium">Téléphone :</span>
                    <p className="text-sm">{user.phoneNumber}</p>
                  </div>
                )}
                {user.age && (
                  <div>
                    <span className="text-sm font-medium">Âge :</span>
                    <p className="text-sm">{user.age} ans</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Informations du compte</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">ID utilisateur :</span>
                  <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {user.id}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Rôles :</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.roles.map((role) => (
                      <Badge 
                        key={role} 
                        variant={role === 'super_admin' ? 'destructive' : role === 'admin' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {user.description && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Description</h4>
              <p className="text-sm bg-muted p-3 rounded-md">{user.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Dates du compte</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Créé le :</span>
                  <p className="text-sm">{format(new Date(user.createdAt), "dd MMM yyyy 'à' HH:mm")}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Dernière mise à jour :</span>
                  <p className="text-sm">{format(new Date(user.updatedAt), "dd MMM yyyy 'à' HH:mm")}</p>
                </div>
                {user.lastActivity && (
                  <div>
                    <span className="text-sm font-medium">Dernière activité :</span>
                    <p className="text-sm">{format(new Date(user.lastActivity), "dd MMM yyyy 'à' HH:mm")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
