"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

export type System = {
  id: string
  system: string
  status: "operational" | "degraded" | "down"
  lastChecked: string
  responseTime: string
  uptime: string
  version: string
}

export const columns: ColumnDef<System>[] = [
  {
    accessorKey: "system",
    header: "System",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "operational"
              ? "default"
              : status === "degraded"
              ? "secondary"
              : "destructive"
          }
          className="flex items-center gap-1"
        >
          {status === "operational" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : status === "degraded" ? (
            <AlertCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "responseTime",
    header: "Response Time",
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
  },
  {
    accessorKey: "lastChecked",
    header: "Last Checked",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastChecked"))
      return date.toLocaleString()
    },
  },
] 