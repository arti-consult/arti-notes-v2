// src/utils/tracking/admin.ts
import { createClient } from "@/utils/supabase/server";

/**
 * Get tracking analytics data for admin dashboard
 */
export async function getTrackingAnalytics() {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated and is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Authentication required");
    }

    // Check if the user has admin role
    const { data: userRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("roles!inner(name)")
      .eq("user_id", user.id);

    if (roleError) {
      throw roleError;
    }

    const isAdmin = userRoles?.some(
      (role) => (role.roles as any).name === "admin"
    );
    if (!isAdmin) {
      throw new Error("Insufficient permissions");
    }

    // Get UTM source statistics
    const { data: utmSourceStats, error: utmSourceError } = await supabase
      .from("tracking_data")
      .select("utm_source, count", { count: "exact" })
      .not("utm_source", "is", null);

    if (utmSourceError) {
      throw utmSourceError;
    }

    // Get UTM medium statistics
    const { data: utmMediumStats, error: utmMediumError } = await supabase
      .from("tracking_data")
      .select("utm_medium, count", { count: "exact" })
      .not("utm_medium", "is", null);

    if (utmMediumError) {
      throw utmMediumError;
    }

    // Get UTM campaign statistics
    const { data: utmCampaignStats, error: utmCampaignError } = await supabase
      .from("tracking_data")
      .select("utm_campaign, count", { count: "exact" })
      .not("utm_campaign", "is", null);

    if (utmCampaignError) {
      throw utmCampaignError;
    }

    // Get referrer statistics
    const { data: referrerStats, error: referrerError } = await supabase
      .from("tracking_data")
      .select("referrer, count", { count: "exact" })
      .not("referrer", "is", null);

    if (referrerError) {
      throw referrerError;
    }

    // Get conversion statistics by calculating the percentage of users who completed onboarding
    const { data: totalUsers, error: totalUsersError } = await supabase
      .from("profiles")
      .select("count")
      .single();

    if (totalUsersError) {
      throw totalUsersError;
    }

    const { data: onboardedUsers, error: onboardedUsersError } = await supabase
      .from("user_onboarding")
      .select("count")
      .not("completed_at", "is", null)
      .single();

    if (onboardedUsersError) {
      throw onboardedUsersError;
    }

    const conversionRate =
      totalUsers.count > 0
        ? (onboardedUsers.count / totalUsers.count) * 100
        : 0;

    return {
      utmSourceStats,
      utmMediumStats,
      utmCampaignStats,
      referrerStats,
      conversionStats: {
        totalUsers: totalUsers.count,
        onboardedUsers: onboardedUsers.count,
        conversionRate: conversionRate.toFixed(2),
      },
    };
  } catch (error) {
    console.error("Error getting tracking analytics:", error);
    throw error;
  }
}

/**
 * Get recent tracking data
 */
export async function getRecentTrackingData(limit: number = 20) {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated and is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Authentication required");
    }

    // Check if the user has admin role
    const { data: userRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("roles!inner(name)")
      .eq("user_id", user.id);

    if (roleError) {
      throw roleError;
    }

    const isAdmin = userRoles?.some(
      (role) => (role.roles as any).name === "admin"
    );
    if (!isAdmin) {
      throw new Error("Insufficient permissions");
    }

    // Get recent tracking data with user info
    const { data, error } = await supabase
      .from("tracking_data")
      .select(
        `
        id,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        landing_page,
        first_visit,
        created_at,
        user_id,
        profiles:user_id (
          email,
          full_name
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data.map((item: any) => ({
      id: item.id,
      utm_source: item.utm_source,
      utm_medium: item.utm_medium,
      utm_campaign: item.utm_campaign,
      referrer: item.referrer,
      landing_page: item.landing_page,
      first_visit: item.first_visit,
      created_at: item.created_at,
      user_id: item.user_id,
      email: item.profiles?.email || null,
      full_name: item.profiles?.full_name || null,
    }));
  } catch (error) {
    console.error("Error getting recent tracking data:", error);
    throw error;
  }
}

/**
 * Get user's tracking data history
 */
export async function getUserTrackingHistory(userId: string) {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated and is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Authentication required");
    }

    // Check if the user has admin role
    const { data: userRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("roles!inner(name)")
      .eq("user_id", user.id);

    if (roleError) {
      throw roleError;
    }

    const isAdmin = userRoles?.some(
      (role) => (role.roles as any).name === "admin"
    );
    if (!isAdmin) {
      throw new Error("Insufficient permissions");
    }

    // Get user tracking history
    const { data, error } = await supabase
      .from("tracking_data")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting user tracking history:", error);
    throw error;
  }
}
