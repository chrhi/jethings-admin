"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarContent as SidebarContentUI,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarOverview, sidebarUsers, sidebarProducts, sidebarAccessControl, sidebarFooter } from "@/const/sidebar"

export function SidebarContent() {
  const pathname = usePathname()

  return (
    <SidebarContentUI>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
        
          <span className="font-semibold text-lg">JeThings Admin</span>
        </div>
      </SidebarHeader>
      <SidebarGroup>
        {sidebarOverview.length > 1 && <SidebarGroupLabel>Overview</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarOverview.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        {sidebarUsers.length > 1 && <SidebarGroupLabel>Users</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarUsers.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>


      <SidebarGroup>
        {sidebarProducts.length > 1 && <SidebarGroupLabel>Products</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarProducts.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        {sidebarAccessControl.length > 1 && <SidebarGroupLabel>Access Control</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarAccessControl.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="mt-auto">
        {sidebarFooter.length > 1 && <SidebarGroupLabel>Settings</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarFooter.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContentUI>
  )
}
