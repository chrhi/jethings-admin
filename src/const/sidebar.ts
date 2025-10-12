import type { LucideIcon } from "lucide-react"
import { Home, Users, UserCog, Store, Settings, Package, Tag, Shield, Lock, FileText, Zap } from "lucide-react"

export type SidebarItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type SidebarGroup = {
  id: string
  label: string
  icon: LucideIcon
  items: SidebarItem[]
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
  {
    label: "Gestion des rôles",
    icon: UserCog,
    href: "/admins",
  },
]



export const sidebarProducts: SidebarItem[] = [
  {
    label: "Produits",
    icon: Package,
    href: "/products",
  },
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

export const sidebarGroups: SidebarGroup[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    items: sidebarOverview,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    items: sidebarUsers,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    items: sidebarProducts,
  },
  {
    id: "access-control",
    label: "Access Control",
    icon: Shield,
    items: sidebarAccessControl,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    items: sidebarFooter,
  },
]