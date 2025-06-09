import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./utils/supabase/server";

// Route constants
const ROUTES = {
  AUTH: {
    BASE: "/(auth)",
    LOGIN: "/login",
    SIGNUP: "/sign-up",
    PAYMENT: "/payment",
    ONBOARDING: "/onboarding",
  },
  DASHBOARD: "/dashboard",
} as const;

// Type for onboarding data
type OnboardingData = {
  payment_completed: boolean;
  completed_at: string | null;
};

export async function middleware(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Initialize Supabase client using the existing server client
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAuthRoute =
      request.nextUrl.pathname.startsWith(ROUTES.AUTH.BASE) ||
      [
        ROUTES.AUTH.LOGIN,
        ROUTES.AUTH.SIGNUP,
        ROUTES.AUTH.PAYMENT,
        ROUTES.AUTH.ONBOARDING,
      ].includes(
        request.nextUrl.pathname as
          | "/login"
          | "/sign-up"
          | "/payment"
          | "/onboarding"
      );
    const isDashboard = request.nextUrl.pathname.startsWith(ROUTES.DASHBOARD);

    // If no user and trying to access protected routes, redirect to sign-up
    if (!user && (isDashboard || request.nextUrl.pathname === "/")) {
      return NextResponse.redirect(new URL(ROUTES.AUTH.SIGNUP, request.url));
    }

    // If user exists, check their flow status
    if (user && isAuthRoute) {
      const { data: onboardingData, error } = await supabase
        .from("user_onboarding")
        .select("payment_completed, completed_at")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching onboarding data:", error);
        return response;
      }

      const hasCompletedPayment = onboardingData?.payment_completed || false;
      const hasCompletedOnboarding = onboardingData?.completed_at !== null;

      // Redirect logic based on completion status
      if (hasCompletedPayment && hasCompletedOnboarding) {
        // Everything complete, go to dashboard
        if (!isDashboard) {
          return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
        }
      } else if (hasCompletedPayment && !hasCompletedOnboarding) {
        // Payment done, needs onboarding
        if (request.nextUrl.pathname !== ROUTES.AUTH.ONBOARDING) {
          return NextResponse.redirect(
            new URL(ROUTES.AUTH.ONBOARDING, request.url)
          );
        }
      } else if (!hasCompletedPayment) {
        // Needs payment first
        if (request.nextUrl.pathname !== ROUTES.AUTH.PAYMENT) {
          return NextResponse.redirect(
            new URL(ROUTES.AUTH.PAYMENT, request.url)
          );
        }
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
