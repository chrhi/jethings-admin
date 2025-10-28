"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarContent as SidebarContentUI,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { sidebarItems } from "@/const/sidebar"

export function SidebarContent() {
  const pathname = usePathname()

  return (
    <SidebarContentUI>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-4">
         
          <span className="font-semibold text-lg">JeThings Admin</span>
        </div>
      </SidebarHeader>

      <div className="flex flex-col gap-2 py-4">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.label}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="flex-1">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </div>
    </SidebarContentUI>
  )
}