import Link from "next/link"
import type { Metadata } from "next"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { sidebar as sidebarItems } from "@/const/sidebar"

export const metadata: Metadata = {
  title: "Tableau de bord",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      className="min-h-svh"
      style={{
        "--sidebar": "var(--primary)",
        "--sidebar-foreground": "var(--primary-foreground)",
        "--sidebar-accent": "color-mix(in oklab, var(--primary) 92%, black 8%)",
        "--sidebar-accent-foreground": "var(--primary-foreground)",
        "--sidebar-border": "color-mix(in oklab, var(--primary) 85%, black 15%)",
        "--sidebar-ring": "color-mix(in oklab, var(--primary) 70%, white 30%)",
      } as React.CSSProperties}
    >
      <Sidebar variant="floating"  collapsible="offcanvas">
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-semibold">Jethings Admin</div>
        </SidebarHeader>
    
        <SidebarContent >
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton asChild>
                        <a>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2  px-4">
          <SidebarTrigger />
          <div className="text-sm text-muted-foreground">Jethings Admin</div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


