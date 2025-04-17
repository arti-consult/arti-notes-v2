"use client"

import { AppSidebar } from "./app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export function SidebarWrapper() {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  )
} 