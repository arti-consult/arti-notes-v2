"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ChartLine,
  ChartBar,
  ChartPieAdvanced,
  ChartContainer,
} from "@/components/ui/chart";
import {
  CalendarDays,
  ChartLineIcon,
  ChartBarIcon,
  ChartPieIcon,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for development - will be replaced with actual Vercel API data
const pageViewsData = [
  { name: "Mon", visits: 320, pageViews: 420 },
  { name: "Tue", visits: 430, pageViews: 610 },
  { name: "Wed", visits: 520, pageViews: 690 },
  { name: "Thu", visits: 490, pageViews: 640 },
  { name: "Fri", visits: 580, pageViews: 720 },
  { name: "Sat", visits: 390, pageViews: 510 },
  { name: "Sun", visits: 450, pageViews: 590 },
];

const sourceData = [
  { name: "Direct", value: 1200 },
  { name: "Search", value: 900 },
  { name: "Social", value: 600 },
  { name: "Referral", value: 400 },
  { name: "Email", value: 200 },
];

const deviceData = [
  { name: "Desktop", value: 65 },
  { name: "Mobile", value: 30 },
  { name: "Tablet", value: 5 },
];

const browserData = [
  { name: "Chrome", users: 1230 },
  { name: "Safari", users: 890 },
  { name: "Firefox", users: 450 },
  { name: "Edge", users: 380 },
  { name: "Other", users: 210 },
];

const countriesData = [
  { name: "United States", users: 940 },
  { name: "United Kingdom", users: 480 },
  { name: "Germany", users: 370 },
  { name: "France", users: 290 },
  { name: "Canada", users: 240 },
  { name: "Other", users: 680 },
];

export function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate loading from Vercel Analytics API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleDateRangeChange = (value: string) => {
    setIsLoading(true);
    setDateRange(value);
    // Here we would fetch new data from Vercel based on the date range
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast.success("Refreshing analytics data...");

    // Simulate API call to refresh data
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Analytics data refreshed successfully!");
    }, 1500);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights from Vercel Analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value="3,240"
          change="+12.5%"
          loading={isLoading}
          trend="up"
          icon={<ChartLineIcon className="h-4 w-4" />}
        />
        <StatCard
          title="Page Views"
          value="12,580"
          change="+8.2%"
          loading={isLoading}
          trend="up"
          icon={<Globe className="h-4 w-4" />}
        />
        <StatCard
          title="Avg. Visit Duration"
          value="2m 45s"
          change="+5.1%"
          loading={isLoading}
          trend="up"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <StatCard
          title="Bounce Rate"
          value="42.3%"
          change="-3.8%"
          loading={isLoading}
          trend="down"
          icon={<ChartPieIcon className="h-4 w-4" />}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Traffic Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>
                Visitors and page views over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {isLoading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <ChartContainer>
                  <ChartLine
                    data={pageViewsData}
                    dataKey="name"
                    categories={["visits", "pageViews"]}
                    height={300}
                    colors={["#9b87f5", "#4A49B0"]}
                    showGrid={true}
                  />
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traffic Sources Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-[250px] flex items-center justify-center">
                    <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
                  </div>
                ) : (
                  <ChartContainer>
                    <ChartPieAdvanced
                      data={sourceData}
                      dataKey="value"
                      nameKey="name"
                      height={250}
                      isDonut={true}
                      colors={[
                        "#9b87f5",
                        "#7E69AB",
                        "#6E59A5",
                        "#4A49B0",
                        "#312E81",
                      ]}
                    />
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Devices Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>Types of devices used</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-[250px] flex items-center justify-center">
                    <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
                  </div>
                ) : (
                  <ChartContainer>
                    <ChartPieAdvanced
                      data={deviceData}
                      dataKey="value"
                      nameKey="name"
                      height={250}
                      isDonut={true}
                      colors={["#6564DB", "#8B80F9", "#A59BFF"]}
                    />
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your site</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
              ) : (
                <TopPagesList />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Detailed breakdown of traffic sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
              ) : (
                <DeviceBreakdown data={sourceData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>
                Detailed breakdown of devices used
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
              ) : (
                <DeviceBreakdown data={deviceData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  loading: boolean;
  icon?: React.ReactNode;
}

function StatCard({
  title,
  value,
  change,
  trend,
  loading,
  icon,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <div
          className={`text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}
        >
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

function TopPagesList() {
  return (
    <div className="space-y-4">
      {[
        { path: "/", views: 1234, uniqueVisitors: 890 },
        { path: "/about", views: 890, uniqueVisitors: 650 },
        { path: "/contact", views: 670, uniqueVisitors: 450 },
        { path: "/blog", views: 450, uniqueVisitors: 320 },
        { path: "/pricing", views: 320, uniqueVisitors: 280 },
      ].map((page, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium">{page.path}</div>
            <div className="text-sm text-muted-foreground">
              {page.uniqueVisitors} unique visitors
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{page.views}</div>
            <div className="text-sm text-muted-foreground">views</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeviceBreakdown({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">{item.value}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}
