(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__4460937a._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/utils/supabase/server.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
"use server";
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://wnxwqdupndeqijmamdkp.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHdxZHVwbmRlcWlqbWFtZGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDU4NTksImV4cCI6MjA0NzQyMTg1OX0.pJ2CF508xkmP2IPEoSkqJ45lMmNySVxHJYxeZ_Ge3Pw"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set({
                        name,
                        value,
                        ...options
                    });
                } catch (error) {
                    // Handle cookie setting error
                    console.error("Error setting cookie:", error);
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: "",
                        ...options
                    });
                } catch (error) {
                    // Handle cookie removal error
                    console.error("Error removing cookie:", error);
                }
            }
        }
    });
}
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [middleware-edge] (ecmascript)");
;
;
// Route constants
const ROUTES = {
    LOGIN: "/login",
    SIGNUP: "/sign-up",
    PAYMENT: "/payment",
    ONBOARDING: "/onboarding",
    DASHBOARD: "/dashboard"
};
async function middleware(request) {
    try {
        const currentPath = request.nextUrl.pathname;
        console.log("=== MIDDLEWARE START ===", {
            pathname: currentPath,
            timestamp: new Date().toISOString()
        });
        // Skip middleware for static files, API routes, and auth callback
        if (currentPath.startsWith("/_next") || currentPath.startsWith("/api") || currentPath.startsWith("/auth/callback") || currentPath === "/session-debug" || // Allow session debug page
        currentPath.includes(".")) {
            console.log("Skipping middleware for:", currentPath);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request: {
                headers: request.headers
            }
        });
        // Initialize Supabase client
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log("=== USER CHECK ===", {
            hasUser: !!user,
            userId: user?.id,
            userEmail: user?.email,
            emailConfirmed: user?.email_confirmed_at,
            userError: userError?.message
        });
        // Define route categories
        const isAuthRoute = [
            ROUTES.LOGIN,
            ROUTES.SIGNUP,
            ROUTES.PAYMENT,
            ROUTES.ONBOARDING
        ].includes(currentPath);
        const isDashboard = currentPath.startsWith(ROUTES.DASHBOARD);
        const isHomePage = currentPath === "/";
        // No user - redirect to signup (except if already on auth routes)
        if (!user) {
            if (isDashboard || isHomePage) {
                console.log("No user, redirecting to signup");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(ROUTES.SIGNUP, request.url));
            }
            console.log("No user, but on auth route - allowing");
            return response;
        }
        // User exists but email not confirmed (shouldn't happen with disabled confirmation, but just in case)
        if (!user.email_confirmed_at) {
            console.log("User email not confirmed");
            if (isDashboard) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(ROUTES.SIGNUP, request.url));
            }
            return response;
        }
        // User exists and email confirmed - check onboarding status
        console.log("=== CHECKING ONBOARDING STATUS ===");
        const { data: onboardingData, error: onboardingError } = await supabase.from("user_onboarding").select("payment_completed, completed_at").eq("user_id", user.id).maybeSingle();
        if (onboardingError && onboardingError.code !== "PGRST116") {
            console.error("Error fetching onboarding data:", onboardingError);
        }
        const hasCompletedPayment = onboardingData?.payment_completed || false;
        const hasCompletedOnboarding = onboardingData?.completed_at !== null && onboardingData !== null;
        console.log("=== USER STATUS ===", {
            hasCompletedPayment,
            hasCompletedOnboarding,
            currentPath,
            onboardingData
        });
        // CRITICAL: Prevent redirect loops by being very specific about when to redirect
        if (hasCompletedPayment && hasCompletedOnboarding) {
            // User is fully complete - only redirect auth routes to dashboard
            if (isAuthRoute) {
                console.log("Complete user on auth route, redirecting to dashboard");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(ROUTES.DASHBOARD, request.url));
            }
        } else if (hasCompletedPayment && !hasCompletedOnboarding) {
            // Payment complete, needs onboarding - only redirect if NOT on onboarding page
            if (currentPath !== ROUTES.ONBOARDING) {
                console.log("Payment complete, redirecting to onboarding");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(ROUTES.ONBOARDING, request.url));
            }
        } else {
            // No payment completed yet - redirect to payment BUT...
            // IMPORTANT: Don't redirect if already on payment page or signup/login pages
            if (currentPath !== ROUTES.PAYMENT && currentPath !== ROUTES.LOGIN && currentPath !== ROUTES.SIGNUP) {
                console.log("No payment, redirecting to payment");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(ROUTES.PAYMENT, request.url));
            }
            // Special case: if user is on signup page but they already exist, redirect to payment
            if (currentPath === ROUTES.SIGNUP) {
                console.log("Existing user on signup page, redirecting to payment");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(ROUTES.PAYMENT, request.url));
            }
        }
        console.log("=== MIDDLEWARE END - NO REDIRECT ===");
        return response;
    } catch (error) {
        console.error("=== MIDDLEWARE ERROR ===", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4460937a._.js.map