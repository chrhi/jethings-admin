import { 
  KPICards, 
  UserGrowthChart, 
  RoleDistributionChart, 
  ActivityChart, 
  SystemMetricsChart,
  RecentActivity 
} from "@/features/dashboard"

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Monitor system performance and user activity.
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <UserGrowthChart />
        <RoleDistributionChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityChart />
        <SystemMetricsChart />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <RecentActivity />
        <div className="space-y-4">
          {/* Quick Actions Card */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium">Create New User</div>
                <div className="text-sm text-muted-foreground">Add a new user to the system</div>
              </button>
              <button className="w-full text-left p-3 rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium">Manage Roles</div>
                <div className="text-sm text-muted-foreground">Configure user permissions</div>
              </button>
              <button className="w-full text-left p-3 rounded-md border hover:bg-muted transition-colors">
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-muted-foreground">Update system configuration</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
