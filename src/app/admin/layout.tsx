"use client";

import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="flex justify-end items-center p-4">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
