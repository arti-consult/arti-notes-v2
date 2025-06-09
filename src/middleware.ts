import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/sign-up",
  "/auth/callback",
  "/auth/auth-code-error",
  "/error",
  "/api",
  "/session-debug",
];

// Routes that require authentication but have specific flow logic
const authRoutes = ["/payment", "/onboarding", "/dashboard"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route === "/api") {
      return pathname.startsWith("/api/");
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🛡️ Middleware checking:", pathname);

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    console.log("✅ Public route, allowing access");
    return NextResponse.next();
  }

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const supabase = await createClient();

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("🔐 Session check:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      error: sessionError?.message,
    });

    // If no session, redirect to login
    if (!session) {
      console.log("❌ No session, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const user = session.user;

    // Check if email is confirmed
    if (!user.email_confirmed_at) {
      console.log("📧 Email not confirmed, allowing access to current page");
      return NextResponse.next();
    }

    // For authenticated routes, check user's flow status
    if (isAuthRoute(pathname)) {
      // Get user's onboarding status
      const { data: onboarding, error: onboardingError } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (onboardingError && onboardingError.code !== "PGRST116") {
        console.error("🚨 Error fetching onboarding data:", onboardingError);
        // Allow access on error to prevent blocking
        return NextResponse.next();
      }

      const hasCompletedPayment = onboarding?.payment_completed || false;
      const hasCompletedOnboarding = onboarding?.completed_at !== null;
      const paymentLinkTag =
        onboarding?.payment_link_tag || user.user_metadata?.payment_link_tag;

      console.log("📊 User flow status:", {
        userId: user.id,
        hasCompletedPayment,
        hasCompletedOnboarding,
        paymentLinkTag,
        currentPath: pathname,
      });

      // Flow logic based on current status
      if (!hasCompletedPayment) {
        // User hasn't completed payment
        if (pathname !== "/payment") {
          console.log("💳 Redirecting to payment");

          // Construct payment URL with tag if available
          let paymentUrl;
          if (paymentLinkTag) {
            paymentUrl = `https://buy.stripe.com/${paymentLinkTag}`;
          } else {
            paymentUrl = "https://buy.stripe.com/test_8x228r7TA4qU57l4d1ak002"; // Default
          }

          return NextResponse.redirect(new URL(paymentUrl));
        }
      } else if (hasCompletedPayment && !hasCompletedOnboarding) {
        // User completed payment but not onboarding
        if (pathname !== "/onboarding") {
          console.log("📝 Redirecting to onboarding");
          const onboardingUrl = new URL("/onboarding", request.url);
          return NextResponse.redirect(onboardingUrl);
        }
      } else if (hasCompletedPayment && hasCompletedOnboarding) {
        // User has completed both payment and onboarding
        if (pathname === "/payment" || pathname === "/onboarding") {
          console.log("🏠 Redirecting completed user to dashboard");
          const dashboardUrl = new URL("/dashboard", request.url);
          return NextResponse.redirect(dashboardUrl);
        }
        // Allow access to dashboard and other authenticated routes
      }
    }

    // Default: allow access
    console.log("✅ Access granted");
    return NextResponse.next();
  } catch (error) {
    console.error("🚨 Middleware error:", error);
    // On error, redirect to login for safety
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
