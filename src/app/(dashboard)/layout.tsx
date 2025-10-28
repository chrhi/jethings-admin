import {
  Sidebar,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarContent } from "@/layout/sidebar-content"
import OurSidebarHeader from "@/components/layout/sidebar-header"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
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
              <div className="">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
    </ProtectedRoute>
  )
}


