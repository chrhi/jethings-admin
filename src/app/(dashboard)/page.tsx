import { 
  KPICards, 
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
    </div>
  )
}
