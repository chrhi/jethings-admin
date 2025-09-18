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
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Users Management",
    icon: Users,
    href: "/users",
  },
  {
    label: "Admins Management",
    icon: UserCog,
    href: "/admins",
  },
]