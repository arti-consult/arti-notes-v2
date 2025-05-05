import { AnalyticsDashboard } from "./dashboard";
import { Analytics } from "@vercel/analytics/react";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <AnalyticsDashboard />
      <Analytics />
    </div>
  );
}
