import type { LucideIcon } from "lucide-react"
import { Home, Users, UserCog } from "lucide-react"

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
    href: "/roles",
  },
]