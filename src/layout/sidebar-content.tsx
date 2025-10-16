"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarContent as SidebarContentUI,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { sidebarGroups, type SidebarGroup as SidebarGroupType, type SidebarItem } from "@/const/sidebar"

export function SidebarContent() {
  const pathname = usePathname()

  // Determine which group should be open based on current pathname
  const getActiveGroupFromPath = () => {
    for (const group of sidebarGroups) {
      for (const item of group.items) {
        if (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) {
          return group.id
        }
      }
    }
    return null
  }

  const activeGroup = getActiveGroupFromPath()
  const defaultValue = activeGroup || "overview" // Default to overview if no active group

  return (
    <SidebarContentUI>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="font-semibold text-lg">JeThings Admin</span>
        </div>
      </SidebarHeader>
      
      <Accordion type="single" collapsible defaultValue={defaultValue} className="w-full">
        {sidebarGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id} className="border-none">
            <AccordionTrigger className="py-2 px-2 hover:no-underline [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <group.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{group.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <SidebarMenu>
                {group.items.map((item: SidebarItem) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/" && pathname.startsWith(item.href))
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} className="pl-6">
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SidebarContentUI>
  )
}
