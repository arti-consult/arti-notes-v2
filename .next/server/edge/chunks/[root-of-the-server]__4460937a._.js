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
// Public routes that don't require authentication
const publicRoutes = [
    "/",
    "/login",
    "/sign-up",
    "/auth/callback",
    "/auth/auth-code-error",
    "/error",
    "/api",
    "/session-debug"
];
// Routes that require authentication but have specific flow logic
const authRoutes = [
    "/payment",
    "/onboarding",
    "/dashboard"
];
function isPublicRoute(pathname) {
    return publicRoutes.some((route)=>{
        if (route === "/api") {
            return pathname.startsWith("/api/");
        }
        return pathname === route || pathname.startsWith(`${route}/`);
    });
}
function isAuthRoute(pathname) {
    return authRoutes.some((route)=>{
        return pathname === route || pathname.startsWith(`${route}/`);
    });
}
async function middleware(request) {
    const { pathname } = request.nextUrl;
    console.log("🛡️ Middleware checking:", pathname);
    // Skip middleware for public routes
    if (isPublicRoute(pathname)) {
        console.log("✅ Public route, allowing access");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Skip middleware for static files and Next.js internals
    if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon") || pathname.includes(".")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createClient"])();
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("🔐 Session check:", {
            hasSession: !!session,
            userEmail: session?.user?.email,
            error: sessionError?.message
        });
        // If no session, redirect to login
        if (!session) {
            console.log("❌ No session, redirecting to login");
            const loginUrl = new URL("/login", request.url);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
        const user = session.user;
        // Check if email is confirmed
        if (!user.email_confirmed_at) {
            console.log("📧 Email not confirmed, allowing access to current page");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        // For authenticated routes, check user's flow status
        if (isAuthRoute(pathname)) {
            // Get user's onboarding status
            const { data: onboarding, error: onboardingError } = await supabase.from("user_onboarding").select("*").eq("user_id", user.id).maybeSingle();
            if (onboardingError && onboardingError.code !== "PGRST116") {
                console.error("🚨 Error fetching onboarding data:", onboardingError);
                // Allow access on error to prevent blocking
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            }
            const hasCompletedPayment = onboarding?.payment_completed || false;
            const hasCompletedOnboarding = onboarding?.completed_at !== null;
            const paymentLinkTag = onboarding?.payment_link_tag || user.user_metadata?.payment_link_tag;
            console.log("📊 User flow status:", {
                userId: user.id,
                hasCompletedPayment,
                hasCompletedOnboarding,
                paymentLinkTag,
                currentPath: pathname
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
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(paymentUrl));
                }
            } else if (hasCompletedPayment && !hasCompletedOnboarding) {
                // User completed payment but not onboarding
                if (pathname !== "/onboarding") {
                    console.log("📝 Redirecting to onboarding");
                    const onboardingUrl = new URL("/onboarding", request.url);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(onboardingUrl);
                }
            } else if (hasCompletedPayment && hasCompletedOnboarding) {
                // User has completed both payment and onboarding
                if (pathname === "/payment" || pathname === "/onboarding") {
                    console.log("🏠 Redirecting completed user to dashboard");
                    const dashboardUrl = new URL("/dashboard", request.url);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(dashboardUrl);
                }
            // Allow access to dashboard and other authenticated routes
            }
        }
        // Default: allow access
        console.log("✅ Access granted");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    } catch (error) {
        console.error("🚨 Middleware error:", error);
        // On error, redirect to login for safety
        const loginUrl = new URL("/login", request.url);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */ "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4460937a._.js.map