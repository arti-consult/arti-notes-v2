(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__dc15d093._.js", {

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
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/middleware.ts
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
;
;
// Define protection rules for routes
const protectedRoutes = [
    {
        path: "/dashboard",
        requireAuth: true,
        minTier: "free"
    },
    {
        path: "/admin",
        requireAuth: true,
        minTier: "admin"
    },
    {
        path: "/settings",
        requireAuth: true,
        minTier: "free"
    },
    {
        path: "/meetings",
        requireAuth: true,
        minTier: "free"
    },
    {
        path: "/api/recordings",
        requireAuth: true,
        minTier: "free"
    }
];
async function middleware(request) {
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: request.headers
        }
    });
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://wnxwqdupndeqijmamdkp.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHdxZHVwbmRlcWlqbWFtZGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDU4NTksImV4cCI6MjA0NzQyMTg1OX0.pJ2CF508xkmP2IPEoSkqJ45lMmNySVxHJYxeZ_Ge3Pw"), {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request: {
                        headers: request.headers
                    }
                });
                cookiesToSet.forEach(({ name, value, options })=>response.cookies.set(name, value, options));
            }
        }
    });
    // Use getUser for secure authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;
    // If not logged in, redirect to login
    if (!user) {
        if (pathname !== "/login") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
        }
        return response;
    }
    // 1. Check for active or trialing subscription
    const { data: subscription } = await supabase.from("subscriptions").select("status").eq("user_id", user.id).in("status", [
        "active",
        "trialing"
    ]).single();
    console.log("User ID:", user.id);
    console.log("Subscription found:", subscription);
    if (!subscription && pathname !== "/subscribe" && pathname !== "/") {
        // Allow access to home page without subscription
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/subscribe", request.url));
    }
    // 2. Check onboarding
    const { data: onboarding } = await supabase.from("user_onboarding").select("completed_at").eq("user_id", user.id).not("completed_at", "is", null).single();
    if (subscription && !onboarding && pathname !== "/onboarding") {
        // Redirect to onboarding if not completed
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/onboarding", request.url));
    }
    // 3. If both are true, allow access to dashboard
    if (pathname === "/dashboard" && (!subscription || !onboarding)) {
        // If trying to access dashboard without both, redirect accordingly
        if (!subscription) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/subscribe", request.url));
        }
        if (!onboarding) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/onboarding", request.url));
        }
    }
    // Check if the path is protected
    const protectedRoute = protectedRoutes.find((route)=>pathname.startsWith(route.path));
    // If route is protected and user is not authenticated, redirect to login
    if (protectedRoute?.requireAuth && !user) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
    }
    // If authenticated and route requires a minimum tier
    if (user && protectedRoute?.minTier) {
        // Skip tier check for admin paths if the path itself requires admin access
        if (pathname.startsWith("/admin") && protectedRoute.minTier === "admin") {
            // Check if user is admin
            const { data } = await supabase.from("user_roles").select(`
          roles!inner (
            name
          )
        `).eq("user_id", user.id).eq("roles.name", "admin");
            // If not admin, redirect to dashboard
            if (!data || data.length === 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", request.url));
            }
        } else if (protectedRoute.minTier !== "free") {
            // For non-admin paths that require a minimum tier other than free
            const getTierLevel = (tier)=>{
                const levels = {
                    free: 0,
                    basic: 1,
                    premium: 2,
                    admin: 3
                };
                return levels[tier] || 0;
            };
            const { data: userRoles } = await supabase.from("user_roles").select(`
          roles!inner (
            name
          )
        `).eq("user_id", user.id);
            const minTierLevel = getTierLevel(protectedRoute.minTier);
            const userTiers = userRoles?.map((ur)=>getTierLevel(ur.roles.name)) || [];
            const maxUserTier = Math.max(...userTiers, 0);
            if (maxUserTier < minTierLevel) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/pricing?upgrade=true", request.url));
            }
        }
    }
    // Only check subscription for protected routes
    if (protectedRoute?.requireAuth) {
        const { data: subscription } = await supabase.from("subscriptions").select("status").eq("user_id", user.id).in("status", [
            "active",
            "trialing"
        ]).single();
        if (!subscription && pathname !== "/subscribe") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/subscribe", request.url));
        }
    }
    return response;
}
const config = {
    matcher: [
        /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (assets)
     * - api/webhooks (webhook endpoints)
     * - auth pages (to prevent redirect loops)
     */ "/((?!_next/static|_next/image|favicon.ico|api/webhooks|login|register|onboarding|pricing|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__dc15d093._.js.map