import {
  Sidebar,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarContent } from "@/layout/sidebar-content"
import OurSidebarHeader from "@/components/layout/sidebar-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <Sidebar 
          variant="sidebar" 
          collapsible="offcanvas"
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


