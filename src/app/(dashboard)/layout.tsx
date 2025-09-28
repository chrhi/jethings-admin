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
import OurSidebarHeader from "@/components/layout/sidebar-header"

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
          <SidebarContent />
          <SidebarFooter>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <div className="flex flex-col w-full">
          <OurSidebarHeader />
          <SidebarInset className="flex-1">
            <div className="p-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
  )
}


