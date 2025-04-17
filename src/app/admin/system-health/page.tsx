import { DataTable } from "./components/data-table"
import { columns, System } from "./components/columns"

const systemsData: System[] = [
  {
    id: "1",
    system: "Supabase",
    status: "operational",
    lastChecked: "2024-04-16T12:00:00Z",
    responseTime: "120ms",
    uptime: "99.99%",
    version: "1.0.0",
  },
  {
    id: "2",
    system: "OpenAI",
    status: "operational",
    lastChecked: "2024-04-16T12:00:00Z",
    responseTime: "450ms",
    uptime: "99.95%",
    version: "4.0.0",
  },
  {
    id: "3",
    system: "Recall AI",
    status: "degraded",
    lastChecked: "2024-04-16T12:00:00Z",
    responseTime: "800ms",
    uptime: "99.80%",
    version: "2.1.0",
  },
]

export default function SystemsCheckPage() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Systems Status</h1>
        <p className="text-muted-foreground">
          Monitor the status and performance of all integrated systems.
        </p>
      </div>
      <DataTable columns={columns} data={systemsData} />
    </div>
  )
}
