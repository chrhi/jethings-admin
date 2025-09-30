import type { LucideIcon } from "lucide-react"
import { Home, Users, UserCog, Store, Settings, Package, Tag } from "lucide-react"

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



export const sidebarFooter: SidebarItem[] = [
  {
    label: "Paramètres",
    icon: Settings,
    href: "/settings",
  },
]