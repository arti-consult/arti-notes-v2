"use client"

import { LayoutDashboard, Users, CreditCard, Brain, Activity, Shield, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Customers CRM",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "AI Costs",
    url: "/admin/ai-costs",
    icon: Brain,
  },
  {
    title: "System Health",
    url: "/admin/system-health",
    icon: Activity,
  },
  {
    title: "Access",
    url: "/admin/access",
    icon: Shield,
  },
  {
    title: "Stripe Dashboard",
    url: "https://dashboard.stripe.com/test/dashboard",
    icon: CreditCard,
    external: true,
  },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild={true}
                className={cn(
                  "transition-colors",
                  !item.external && pathname === item.url && "bg-accent text-accent-foreground",
                  !item.external && pathname.startsWith(item.url) && item.url !== "/admin" && "bg-accent text-accent-foreground"
                )}
              >
                <Link
                  href={item.url}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
