// src/middleware.ts
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
const authRoutes = ["/onboarding", "/dashboard"];

// Routes that should check payment status but allow access
const paymentAwareRoutes = ["/payment"];

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

function isPaymentAwareRoute(pathname: string): boolean {
  return paymentAwareRoutes.some((route) => {
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
      loginUrl.searchParams.set("error", "session_not_found");
      return NextResponse.redirect(loginUrl);
    }

    const user = session.user;

    // Check if email is confirmed
    if (!user.email_confirmed_at) {
      console.log("📧 Email not confirmed, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "email_not_confirmed");
      return NextResponse.redirect(loginUrl);
    }

    // For authenticated routes, check user's flow status
    if (isAuthRoute(pathname) || isPaymentAwareRoute(pathname)) {
      // Get user's onboarding status
      const { data: onboarding, error: onboardingError } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (onboardingError) {
        console.error("🚨 Error fetching onboarding data:", onboardingError);
        // Redirect to error page on database error
        const errorUrl = new URL("/error", request.url);
        errorUrl.searchParams.set("message", "Failed to fetch user data");
        return NextResponse.redirect(errorUrl);
      }

      const hasCompletedPayment = onboarding?.payment_completed || false;
      const hasCompletedOnboarding = onboarding?.completed_at !== null;
      const hasOnboardingAnswers = !!(
        onboarding?.user_type && onboarding?.referral_source
      );

      // Get payment link from environment variable or fallback to user metadata
      const paymentLinkTag =
        process.env.DEFAULT_PAYMENT_LINK_TAG ||
        onboarding?.payment_link_tag ||
        user.user_metadata?.payment_link_tag;

      console.log("📊 User flow status:", {
        userId: user.id,
        hasCompletedPayment,
        hasCompletedOnboarding,
        hasOnboardingAnswers,
        userType: onboarding?.user_type,
        referralSource: onboarding?.referral_source,
        completedAt: onboarding?.completed_at,
        paymentLinkTag,
        currentPath: pathname,
      });

      // Flow logic based on current status
      if (!hasCompletedPayment) {
        // User hasn't completed payment
        if (pathname !== "/payment" && !isPaymentAwareRoute(pathname)) {
          console.log("💳 Redirecting to payment");
          const paymentUrl = paymentLinkTag
            ? `https://buy.stripe.com/${paymentLinkTag}`
            : new URL("/payment", request.url);
          return NextResponse.redirect(paymentUrl);
        }
      } else if (hasCompletedPayment && !hasOnboardingAnswers) {
        // User completed payment but hasn't answered onboarding questions
        if (!pathname.startsWith("/onboarding")) {
          console.log("📝 Redirecting to onboarding - Missing answers");
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      } else if (
        hasCompletedPayment &&
        hasOnboardingAnswers &&
        !hasCompletedOnboarding
      ) {
        // User has answered questions but hasn't completed the full onboarding flow
        const connectAccountPath = "/onboarding/connect-account";
        if (pathname === "/onboarding" || !pathname.startsWith("/onboarding")) {
          console.log("📅 Redirecting to calendar connection");
          return NextResponse.redirect(
            new URL(connectAccountPath, request.url)
          );
        }
      } else if (
        hasCompletedPayment &&
        hasCompletedOnboarding &&
        hasOnboardingAnswers
      ) {
        // User has completed both payment and onboarding
        if (pathname === "/payment" || pathname.startsWith("/onboarding")) {
          console.log("🏠 Redirecting completed user to dashboard");
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // Allow access to dashboard and other authenticated routes
        console.log("✅ Fully completed user accessing dashboard");
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
