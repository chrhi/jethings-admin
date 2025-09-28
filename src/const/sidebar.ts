import type { LucideIcon } from "lucide-react"
import { Home, Users, UserCog, Store, Settings } from "lucide-react"

export type SidebarItem = {
  label: string
  href: string
  icon: LucideIcon
  items?: SidebarItem[]
}

export const sidebar: SidebarItem[] = [
  {
    label: "Tableau de bord",
    icon: Home,
    href: "/",
  },
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