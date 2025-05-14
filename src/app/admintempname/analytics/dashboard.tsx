"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getAnalyticsData } from "./actions";

interface AnalyticsData {
  pageViews: number;
  visitors: number;
  bounceRate: number;
  routes: Array<{
    path: string;
    views: number;
  }>;
  referrers: Array<{
    source: string;
    count: number;
  }>;
  utmParams: Array<{
    source: string;
    medium: string;
    campaign: string;
    count: number;
  }>;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the last 30 days of data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const analyticsData = await getAnalyticsData(
          startDate.toISOString(),
          endDate.toISOString()
        );
        setData(analyticsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch analytics data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pageViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.visitors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bounceRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Views by Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.routes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="path" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.referrers.map((referrer) => (
                  <TableRow key={referrer.source}>
                    <TableCell>{referrer.source}</TableCell>
                    <TableCell className="text-right">
                      {referrer.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UTM Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.utmParams.map((utm, index) => (
                  <TableRow key={index}>
                    <TableCell>{utm.source}</TableCell>
                    <TableCell>{utm.medium}</TableCell>
                    <TableCell>{utm.campaign}</TableCell>
                    <TableCell className="text-right">{utm.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* --- New Section: Countries, Devices, Operating Systems --- */}
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        {/* Countries Card */}
        <Card className="bg-[#18181b] text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Countries</CardTitle>
            <span className="text-xs text-gray-400">VISITORS</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { flag: "🇳🇴", name: "Norway", percent: 95 },
                { flag: "🇪🇸", name: "Spain", percent: 1 },
                { flag: "🇭🇰", name: "Hong Kong", percent: 1 },
                { flag: "🇮🇪", name: "Ireland", percent: 1 },
                { flag: "🇸🇪", name: "Sweden", percent: 1 },
              ].map((country, i) => (
                <div
                  key={country.name}
                  className={`flex items-center justify-between px-2 py-1 rounded ${
                    i === 0 ? "bg-[#232326]" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                  <span className="font-semibold">{country.percent}%</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <button className="bg-[#232326] text-xs px-3 py-1 rounded">
                  View All
                </button>
                <button className="bg-[#232326] text-xs px-2 py-1 rounded">
                  ...
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Card with Tabs */}
        <Card className="bg-[#18181b] text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex gap-2">
              <button className="bg-[#232326] text-xs px-3 py-1 rounded font-semibold">
                Devices
              </button>
              <button className="text-xs px-3 py-1 rounded text-gray-400">
                Browsers
              </button>
            </div>
            <span className="text-xs text-gray-400">VISITORS</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Mobile", percent: 63 },
                { name: "Desktop", percent: 35 },
                { name: "Tablet", percent: 1 },
              ].map((device) => (
                <div
                  key={device.name}
                  className="flex items-center justify-between px-2 py-1 rounded"
                >
                  <span>{device.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#232326] rounded h-4 w-32 relative overflow-hidden">
                      <div
                        className="bg-white/30 h-4 absolute left-0 top-0"
                        style={{ width: `${device.percent}%` }}
                      />
                    </div>
                    <span className="font-semibold">{device.percent}%</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <button className="bg-[#232326] text-xs px-3 py-1 rounded">
                  View All
                </button>
                <button className="bg-[#232326] text-xs px-2 py-1 rounded">
                  ...
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Systems Card */}
        <Card className="bg-[#18181b] text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">
              Operating Systems
            </CardTitle>
            <span className="text-xs text-gray-400">VISITORS</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "iOS", percent: 37 },
                { name: "Android", percent: 28 },
                { name: "Windows", percent: 24 },
                { name: "Mac", percent: 11 },
              ].map((os) => (
                <div
                  key={os.name}
                  className="flex items-center justify-between px-2 py-1 rounded"
                >
                  <span>{os.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#232326] rounded h-4 w-32 relative overflow-hidden">
                      <div
                        className="bg-white/30 h-4 absolute left-0 top-0"
                        style={{ width: `${os.percent}%` }}
                      />
                    </div>
                    <span className="font-semibold">{os.percent}%</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <button className="bg-[#232326] text-xs px-3 py-1 rounded">
                  View All
                </button>
                <button className="bg-[#232326] text-xs px-2 py-1 rounded">
                  ...
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
