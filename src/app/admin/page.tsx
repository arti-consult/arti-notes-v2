import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ChartAreaInteractive } from "./components/chart-area-interactive";
import { DataTable } from "./components/data-table/data-table";
import { SectionCards } from "./components/section-cards";
import { SiteHeader } from "./components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import data from "./data.json";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex flex-1 flex-col bg-gradient-to-b from-background to-muted">
        <SiteHeader />
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
            <div className="space-y-2 px-4 lg:px-6">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your documents today.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 " />
              <SectionCards />
            </div>
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Recent Documents
                </h2>
                <p className="text-muted-foreground">
                  Your most recent document activity and updates.
                </p>
              </div>
              <div className="mt-4 rounded-lg border bg-card">
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
