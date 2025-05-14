
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
  BarChart
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Menu items
const mainItems = [
  {
    title: "Customers",
    url: "/",
    icon: Kanban
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart
  },
  {
    title: "Email Sender",
    url: "/email-sender",
    icon: Mail
  },
  {
    title: "SEO",
    url: "/seo",
    icon: Globe
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Users
  },
  {
    title: "Installation",
    url: "/installation-guide",
    icon: Wrench
  },
  {
    title: "Automation",
    url: "/automation",
    icon: Share2
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings
  }
];

const secondaryItems = [
  {
    title: "Documentation",
    url: "/docs",
    icon: FileText
  },
  {
    title: "About",
    url: "/about",
    icon: Info
  }
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-14 px-4 border-b">
        <h1 className="text-xl font-bold">Customer CRM</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.url || 
                             (item.url !== "/" && location.pathname.startsWith(item.url))}
                  >
                    <Link to={item.url}>
                      <item.icon className={cn(
                        "h-5 w-5",
                        (location.pathname === item.url || 
                         (item.url !== "/" && location.pathname.startsWith(item.url))) && 
                        "text-primary"
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className={cn(
                        "h-5 w-5",
                        location.pathname === item.url && "text-primary"
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>© 2025 Customer CRM</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
