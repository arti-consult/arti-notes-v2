"use client";

import {
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  FileText,
  Info,
  Share2,
  Kanban,
  Mail,
  Globe,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu items
const mainItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Email Sender",
    url: "/admin/email-sender",
    icon: Mail,
  },
  {
    title: "SEO",
    url: "/admin/seo",
    icon: Globe,
  },
  {
    title: "Roles",
    url: "/admin/roles",
    icon: Users,
  },
  {
    title: "Installation",
    url: "/admin/installation",
    icon: Wrench,
  },
  {
    title: "Automation",
    url: "/admin/automation",
    icon: Share2,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const secondaryItems = [
  {
    title: "Documentation",
    url: "/admin/docs",
    icon: FileText,
  },
  {
    title: "About",
    url: "/admin/about",
    icon: Info,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-card border-r flex flex-col">
      <div className="h-14 px-4 border-b flex items-center">
        <h1 className="text-xl font-bold">Customer CRM</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2 px-2">
              Main Navigation
            </h2>
            <nav className="space-y-1">
              {mainItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors",
                    pathname === item.url && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2 px-2">
              Resources
            </h2>
            <nav className="space-y-1">
              {secondaryItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors",
                    pathname === item.url && "bg-primary/10 text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>© 2025 Customer CRM</span>
        </div>
      </div>
    </div>
  );
}
