import type { Metadata } from "next"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarContent } from "@/layout/sidebar-content"
import Image from "next/image"

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
        style={{
          "--sidebar": "rgb(243 244 246)", 
          "--sidebar-foreground": "rgb(17 24 39)", 
          "--sidebar-accent": "rgb(229 231 235)", 
          "--sidebar-accent-foreground": "rgb(17 24 39)", 
          "--sidebar-border": "rgb(209 213 219)", 
          "--sidebar-ring": "rgb(59 130 246)", 
        } as React.CSSProperties}
      >
        <Sidebar 
          variant="sidebar" 
          collapsible="offcanvas"
          className="bg-gray-100"
        >
          <SidebarHeader>
            <div className="px-2 py-1 text-sm font-semibold w-full flex items-center justify-center">
              <Image src="/logo.png" alt="Jethings Admin" width={60} height={60} />
            </div>
          </SidebarHeader>
      
          <SidebarContent />
          <SidebarFooter>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset >
          <header className="flex h-14 items-center gap-2 px-4 justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="text-sm text-muted-foreground">Jethings Admin</div>
            </div>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}
