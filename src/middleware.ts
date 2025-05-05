// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Define protection rules for routes
const protectedRoutes = [
  {
    path: "/dashboard",
    requireAuth: true,
    minTier: "free", // "free", "basic", "premium", or "admin"
  },
  {
    path: "/admin",
    requireAuth: true,
    minTier: "admin",
  },
  {
    path: "/settings",
    requireAuth: true,
    minTier: "free",
  },
  {
    path: "/meetings",
    requireAuth: true,
    minTier: "free",
  },
  {
    path: "/api/recordings",
    requireAuth: true,
    minTier: "free",
  },
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getUser for secure authentication
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // If not logged in, redirect to login
  if (!user) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  // 1. Check for active or trialing subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  console.log("User ID:", user.id);
  console.log("Subscription found:", subscription);

  if (!subscription && pathname !== "/subscribe" && pathname !== "/") {
    // Allow access to home page without subscription
    return NextResponse.redirect(new URL("/subscribe", request.url));
  }

  // 2. Check onboarding
  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("completed_at")
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .single();

  if (subscription && !onboarding && pathname !== "/onboarding") {
    // Redirect to onboarding if not completed
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 3. If both are true, allow access to dashboard
  if (pathname === "/dashboard" && (!subscription || !onboarding)) {
    // If trying to access dashboard without both, redirect accordingly
    if (!subscription) {
      return NextResponse.redirect(new URL("/subscribe", request.url));
    }
    if (!onboarding) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Check if the path is protected
  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  // If route is protected and user is not authenticated, redirect to login
  if (protectedRoute?.requireAuth && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated and route requires a minimum tier
  if (user && protectedRoute?.minTier) {
    // Skip tier check for admin paths if the path itself requires admin access
    if (pathname.startsWith("/admin") && protectedRoute.minTier === "admin") {
      // Check if user is admin
      const { data } = await supabase
        .from("user_roles")
        .select(
          `
          roles!inner (
            name
          )
        `
        )
        .eq("user_id", user.id)
        .eq("roles.name", "admin");

      // If not admin, redirect to dashboard
      if (!data || data.length === 0) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (protectedRoute.minTier !== "free") {
      // For non-admin paths that require a minimum tier other than free
      const getTierLevel = (tier: string): number => {
        const levels = { free: 0, basic: 1, premium: 2, admin: 3 };
        return levels[tier as keyof typeof levels] || 0;
      };

      const { data: userRoles } = await supabase
        .from("user_roles")
        .select(
          `
          roles!inner (
            name
          )
        `
        )
        .eq("user_id", user.id);

      const minTierLevel = getTierLevel(protectedRoute.minTier);
      const userTiers =
        userRoles?.map((ur) => getTierLevel((ur.roles as any).name)) || [];
      const maxUserTier = Math.max(...userTiers, 0);

      if (maxUserTier < minTierLevel) {
        return NextResponse.redirect(
          new URL("/pricing?upgrade=true", request.url)
        );
      }
    }
  }

  // Only check subscription for protected routes
  if (protectedRoute?.requireAuth) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .single();

    if (!subscription && pathname !== "/subscribe") {
      return NextResponse.redirect(new URL("/subscribe", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (assets)
     * - api/webhooks (webhook endpoints)
     * - auth pages (to prevent redirect loops)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|login|register|onboarding|pricing|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
