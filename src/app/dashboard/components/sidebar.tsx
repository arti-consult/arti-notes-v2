"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  Folder,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Alle møter",
    href: "/dashboard/meetings",
    icon: Calendar,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Mapper",
    href: "/dashboard/folders",
    icon: Folder,
  },
  {
    name: "Abonnement",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
  {
    name: "Innstillinger",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-[#18181B]">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold">Arti Notes</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard/subscription"
              ? pathname.startsWith("/dashboard/subscription")
              : pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[#145DFC]/10 text-[#145DFC]"
                  : "text-gray-700 hover:bg-[#145DFC]/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
