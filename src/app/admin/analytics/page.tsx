import {
  getTrackingAnalytics,
  getRecentTrackingData,
} from "@/utils/tracking/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function AnalyticsDashboard() {
  const analytics = await getTrackingAnalytics();
  const recentData = await getRecentTrackingData();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      {/* Conversion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics.conversionStats.totalUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarded Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics.conversionStats.onboardedUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics.conversionStats.conversionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* UTM Source Stats */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>UTM Source Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.utmSourceStats?.map((stat) => (
              <div
                key={stat.utm_source}
                className="flex justify-between items-center p-4 bg-muted rounded-lg"
              >
                <span className="font-medium">
                  {stat.utm_source || "Direct"}
                </span>
                <span className="text-lg font-bold">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* UTM Medium Stats */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>UTM Medium Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.utmMediumStats?.map((stat) => (
              <div
                key={stat.utm_medium}
                className="flex justify-between items-center p-4 bg-muted rounded-lg"
              >
                <span className="font-medium">
                  {stat.utm_medium || "Direct"}
                </span>
                <span className="text-lg font-bold">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tracking Data */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tracking Data</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={recentData} />
        </CardContent>
      </Card>
    </div>
  );
}
