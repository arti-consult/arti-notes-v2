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
          cookiesToSet.forEach(({ name, value, options }) =>
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Check if the path is protected
  const protectedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  // If route is protected and user is not authenticated, redirect to login
  if (protectedRoute?.requireAuth && !session) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated and route requires a minimum tier
  if (session && protectedRoute?.minTier) {
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
        .eq("user_id", session.user.id)
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
        .eq("user_id", session.user.id);

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

  // Check if the user has completed onboarding
  if (session && pathname === "/dashboard") {
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("user_onboarding")
      .select("completed_at")
      .eq("user_id", session.user.id)
      .not("completed_at", "is", null)
      .single();

    if (!onboardingData && !onboardingError?.code?.includes("not_found")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  // Special handling for auth pages when user is already logged in
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
