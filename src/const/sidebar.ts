import type { LucideIcon } from "lucide-react"
import { Home, Users, UserCog, Store, Settings, Package, Tag, Shield, Lock, FileText, Zap } from "lucide-react"

export type SidebarItem = {
  label: string
  href: string
  icon: LucideIcon
  items?: SidebarItem[]
}

export const sidebarOverview: SidebarItem[] = [
  {
    label: "Tableau de bord",
    icon: Home,
    href: "/",
  },
 
]


export const sidebarUsers: SidebarItem[] = [
  {
    label: "Gestion des utilisateurs",
    icon: Users,
    href: "/users",
  },
  
]



export const sidebarProducts: SidebarItem[] = [

  {
    label: "Produits Types",
    icon: Tag,
    href: "/product-types",
  },
  {
    label: "Gestion des magasins",
    icon: Store,
    href: "/stores",
  },
]

export const sidebarAccessControl: SidebarItem[] = [
  {
    label: "Resources",
    icon: Shield,
    href: "/resources",
  },
  {
    label: "Actions",
    icon: Zap,
    href: "/actions",
  },
  {
    label: "Roles",
    icon: Lock,
    href: "/roles",
  },
  {
    label: "Policies",
    icon: FileText,
    href: "/policies",
  },
]



export const sidebarFooter: SidebarItem[] = [
  {
    label: "Paramètres",
    icon: Settings,
    href: "/settings",
  },
]