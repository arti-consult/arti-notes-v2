import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type TrackingData = {
  id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  landing_page: string | null;
  first_visit: boolean;
  created_at: string;
  email: string | null;
  full_name: string | null;
};

export const columns: ColumnDef<TrackingData>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("created_at")), "PPp");
    },
  },
  {
    accessorKey: "email",
    header: "User",
  },
  {
    accessorKey: "utm_source",
    header: "Source",
    cell: ({ row }) => {
      return row.getValue("utm_source") || "Direct";
    },
  },
  {
    accessorKey: "utm_medium",
    header: "Medium",
    cell: ({ row }) => {
      return row.getValue("utm_medium") || "Direct";
    },
  },
  {
    accessorKey: "utm_campaign",
    header: "Campaign",
    cell: ({ row }) => {
      return row.getValue("utm_campaign") || "-";
    },
  },
  {
    accessorKey: "referrer",
    header: "Referrer",
    cell: ({ row }) => {
      return row.getValue("referrer") || "Direct";
    },
  },
  {
    accessorKey: "landing_page",
    header: "Landing Page",
  },
  {
    accessorKey: "first_visit",
    header: "First Visit",
    cell: ({ row }) => {
      return row.getValue("first_visit") ? "Yes" : "No";
    },
  },
];
