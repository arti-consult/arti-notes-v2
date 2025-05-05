"use server";

import Analytics from "@vercel/analytics";

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

export async function getAnalyticsData(
  startDate: string,
  endDate: string
): Promise<AnalyticsData> {
  try {
    // Mock data to demonstrate the dashboard
    return {
      pageViews: 1234,
      visitors: 567,
      bounceRate: 45.2,
      routes: [
        { path: "/", views: 500 },
        { path: "/features", views: 300 },
        { path: "/pricing", views: 200 },
        { path: "/blog", views: 234 },
      ],
      referrers: [
        { source: "google.com", count: 200 },
        { source: "twitter.com", count: 150 },
        { source: "linkedin.com", count: 100 },
        { source: "Direct", count: 117 },
      ],
      utmParams: [
        { source: "google", medium: "cpc", campaign: "spring_sale", count: 50 },
        {
          source: "facebook",
          medium: "social",
          campaign: "brand_awareness",
          count: 30,
        },
        {
          source: "twitter",
          medium: "social",
          campaign: "product_launch",
          count: 20,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}
