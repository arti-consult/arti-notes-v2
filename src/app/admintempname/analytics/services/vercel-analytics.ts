import { cookies } from "next/headers";

const VERCEL_API_URL = "https://api.vercel.com";

interface VercelAnalyticsResponse {
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

export async function getVercelAnalyticsData(
  projectId: string,
  startDate: string,
  endDate: string
): Promise<VercelAnalyticsResponse> {
  const cookieStore = cookies();
  const vercelToken = cookieStore.get("vercel-token")?.value;

  if (!vercelToken) {
    throw new Error("Vercel token not found");
  }

  const response = await fetch(
    `${VERCEL_API_URL}/v9/analytics/query?projectId=${projectId}&start=${startDate}&end=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  const data = await response.json();

  // Transform the Vercel API response to match our interface
  return {
    pageViews: data.pageViews || 0,
    visitors: data.visitors || 0,
    bounceRate: data.bounceRate || 0,
    routes:
      data.routes?.map((route: any) => ({
        path: route.path,
        views: route.views,
      })) || [],
    referrers:
      data.referrers?.map((referrer: any) => ({
        source: referrer.source,
        count: referrer.count,
      })) || [],
    utmParams:
      data.utmParams?.map((utm: any) => ({
        source: utm.source,
        medium: utm.medium,
        campaign: utm.campaign,
        count: utm.count,
      })) || [],
  };
}
