(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/utils/supabase/client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://wnxwqdupndeqijmamdkp.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHdxZHVwbmRlcWlqbWFtZGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDU4NTksImV4cCI6MjA0NzQyMTg1OX0.pJ2CF508xkmP2IPEoSkqJ45lMmNySVxHJYxeZ_Ge3Pw"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/AuthContext.tsx
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    user: null,
    profile: null,
    session: null,
    subscription: null,
    isLoading: true,
    signOut: async ()=>{}
});
const useAuth = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const AuthProvider = ({ children })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [subscription, setSubscription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const fetchUserData = {
                "AuthProvider.useEffect.fetchUserData": async ()=>{
                    try {
                        setIsLoading(true);
                        // Get session
                        const { data: { session } } = await supabase.auth.getSession();
                        setSession(session);
                        setUser(session?.user || null);
                        if (session?.user) {
                            // Link anonymous tracking data to the user
                            try {
                                // Dynamic import to avoid issues with SSR
                                const { linkTrackingDataToUser } = await __turbopack_context__.r("[project]/src/utils/tracking/server.ts [app-client] (ecmascript, async loader)")(__turbopack_context__.i);
                                await linkTrackingDataToUser(session.user.id);
                            } catch (err) {
                                // Non-fatal error
                                console.error("Error linking tracking data:", err);
                            }
                            // Get profile
                            const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
                            setProfile(profileData);
                            // Get active subscription
                            const { data: subscriptionData } = await supabase.from("subscriptions").select(`
              *,
              plan:pricing_plans(*)
            `).eq("user_id", session.user.id).eq("status", "active").single();
                            if (subscriptionData) {
                                // Format the subscription data
                                setSubscription({
                                    ...subscriptionData,
                                    plan: subscriptionData.plan
                                });
                            } else {
                                setSubscription(null);
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["AuthProvider.useEffect.fetchUserData"];
            fetchUserData();
            // Subscribe to auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": (_event, session)=>{
                    setSession(session);
                    setUser(session?.user || null);
                    if (session) {
                        fetchUserData();
                    } else {
                        setProfile(null);
                        setSubscription(null);
                    }
                }
            }["AuthProvider.useEffect"]);
            return ({
                "AuthProvider.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        supabase,
        router
    ]);
    const signOut = async ()=>{
        await supabase.auth.signOut();
        router.push("/login");
    };
    const value = {
        user,
        profile,
        session,
        subscription,
        isLoading,
        signOut
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 144,
        columnNumber: 10
    }, this);
};
_s1(AuthProvider, "gq/4R4mZzYzKUFo6qfykE3yEtfE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/tracking/constants.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/utils/tracking/constants.ts
// Cookie names
__turbopack_context__.s({
    "ANONYMOUS_ID_COOKIE": (()=>ANONYMOUS_ID_COOKIE),
    "COOKIE_OPTIONS": (()=>COOKIE_OPTIONS),
    "UTM_COOKIE_NAME": (()=>UTM_COOKIE_NAME),
    "VISIT_COOKIE_NAME": (()=>VISIT_COOKIE_NAME)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const UTM_COOKIE_NAME = "arti_utm_data";
const VISIT_COOKIE_NAME = "arti_visit_data";
const ANONYMOUS_ID_COOKIE = "arti_anonymous_id";
const COOKIE_OPTIONS = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    path: "/",
    sameSite: "lax",
    secure: ("TURBOPACK compile-time value", "development") === "production"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/tracking/client.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "clearClientTrackingCookies": (()=>clearClientTrackingCookies),
    "getClientAnonymousId": (()=>getClientAnonymousId),
    "getClientTrackingData": (()=>getClientTrackingData),
    "getClientUTMData": (()=>getClientUTMData),
    "getClientVisitData": (()=>getClientVisitData),
    "setClientAnonymousId": (()=>setClientAnonymousId),
    "setClientUTMData": (()=>setClientUTMData),
    "setClientVisitData": (()=>setClientVisitData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/constants.ts [app-client] (ecmascript)");
;
function getClientUTMData() {
    try {
        const cookies = document.cookie.split(";");
        const utmData = cookies.find((cookie)=>cookie.trim().startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UTM_COOKIE_NAME"]}=`));
        return utmData ? JSON.parse(decodeURIComponent(utmData.split("=")[1])) : null;
    } catch (error) {
        console.error("Error getting client UTM data:", error);
        return null;
    }
}
function getClientVisitData() {
    try {
        const cookies = document.cookie.split(";");
        const visitData = cookies.find((cookie)=>cookie.trim().startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VISIT_COOKIE_NAME"]}=`));
        return visitData ? JSON.parse(decodeURIComponent(visitData.split("=")[1])) : null;
    } catch (error) {
        console.error("Error getting client visit data:", error);
        return null;
    }
}
function getClientAnonymousId() {
    try {
        const cookies = document.cookie.split(";");
        const anonymousId = cookies.find((cookie)=>cookie.trim().startsWith(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"]}=`));
        return anonymousId ? decodeURIComponent(anonymousId.split("=")[1]) : null;
    } catch (error) {
        console.error("Error getting client anonymous ID:", error);
        return null;
    }
}
function getClientTrackingData() {
    return {
        utmData: getClientUTMData(),
        visitData: getClientVisitData(),
        anonymousId: getClientAnonymousId()
    };
}
function setClientUTMData(data) {
    try {
        const cookieValue = encodeURIComponent(JSON.stringify(data));
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UTM_COOKIE_NAME"]}=${cookieValue}; path=/; max-age=${30 * 24 * 60 * 60}; sameSite=lax${("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : ""}`;
    } catch (error) {
        console.error("Error setting client UTM data:", error);
    }
}
function setClientVisitData(data) {
    try {
        const cookieValue = encodeURIComponent(JSON.stringify(data));
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VISIT_COOKIE_NAME"]}=${cookieValue}; path=/; max-age=${30 * 24 * 60 * 60}; sameSite=lax${("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : ""}`;
    } catch (error) {
        console.error("Error setting client visit data:", error);
    }
}
function setClientAnonymousId(id) {
    try {
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"]}=${id}; path=/; max-age=${365 * 24 * 60 * 60}; sameSite=lax${("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : ""}`;
    } catch (error) {
        console.error("Error setting client anonymous ID:", error);
    }
}
function clearClientTrackingCookies() {
    try {
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UTM_COOKIE_NAME"]}=; path=/; max-age=0`;
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VISIT_COOKIE_NAME"]}=; path=/; max-age=0`;
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"]}=; path=/; max-age=0`;
    } catch (error) {
        console.error("Error clearing client tracking cookies:", error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/tracking/utm.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/utils/tracking/utm.ts
__turbopack_context__.s({
    "captureUTMParameters": (()=>captureUTMParameters),
    "captureVisitData": (()=>captureVisitData),
    "clearTrackingCookies": (()=>clearTrackingCookies),
    "getAllTrackingData": (()=>getAllTrackingData),
    "getUTMDataFromCookie": (()=>getUTMDataFromCookie),
    "getVisitDataFromCookie": (()=>getVisitDataFromCookie)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/client.ts [app-client] (ecmascript)");
;
async function captureUTMParameters(url) {
    // Use provided URL or current window URL
    const currentUrl = url || (("TURBOPACK compile-time truthy", 1) ? window.location.href : ("TURBOPACK unreachable", undefined));
    if (!currentUrl) return {};
    try {
        const urlObj = new URL(currentUrl);
        const searchParams = urlObj.searchParams;
        // Extract UTM parameters
        const utmParams = {
            utm_source: searchParams.get("utm_source") || undefined,
            utm_medium: searchParams.get("utm_medium") || undefined,
            utm_campaign: searchParams.get("utm_campaign") || undefined,
            utm_term: searchParams.get("utm_term") || undefined,
            utm_content: searchParams.get("utm_content") || undefined
        };
        // Only save if at least one UTM parameter is present
        if (Object.values(utmParams).some((value)=>value)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setClientUTMData"])(utmParams);
        }
        return utmParams;
    } catch (error) {
        console.error("Error capturing UTM parameters:", error);
        return {};
    }
}
async function captureVisitData() {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    try {
        const visitData = {
            first_visit: new Date().toISOString(),
            referrer: document.referrer || undefined,
            landing_page: window.location.href
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setClientVisitData"])(visitData);
    } catch (error) {
        console.error("Error capturing visit data:", error);
    }
}
async function getUTMDataFromCookie() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientUTMData"])();
}
async function getVisitDataFromCookie() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientVisitData"])();
}
async function getAllTrackingData() {
    const utmData = await getUTMDataFromCookie() || {};
    const visitData = await getVisitDataFromCookie() || {};
    return {
        ...utmData,
        ...visitData
    };
}
async function clearTrackingCookies() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearClientTrackingCookies"])();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/providers/TrackingProvider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>TrackingProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/utm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const ANONYMOUS_ID_COOKIE = "arti_anonymous_id";
const COOKIE_EXPIRY = 365; // 1 year
function TrackingProvider({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // Generate or retrieve anonymous ID for the visitor
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TrackingProvider.useEffect": ()=>{
            const getOrCreateAnonymousId = {
                "TrackingProvider.useEffect.getOrCreateAnonymousId": async ()=>{
                    try {
                        let anonymousId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientAnonymousId"])();
                        if (!anonymousId) {
                            anonymousId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setClientAnonymousId"])(anonymousId);
                        }
                    } catch (error) {
                        console.error("Error handling anonymous ID:", error);
                    }
                }
            }["TrackingProvider.useEffect.getOrCreateAnonymousId"];
            getOrCreateAnonymousId();
        }
    }["TrackingProvider.useEffect"], []);
    // Capture UTM parameters and visit data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TrackingProvider.useEffect": ()=>{
            const captureTrackingData = {
                "TrackingProvider.useEffect.captureTrackingData": async ()=>{
                    try {
                        const anonymousId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientAnonymousId"])();
                        if (!anonymousId) return;
                        // Capture UTM parameters
                        const utmParams = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["captureUTMParameters"])(searchParams.toString());
                        if (Object.keys(utmParams).length > 0) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setClientUTMData"])(utmParams);
                        }
                        // Capture visit data
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["captureVisitData"])();
                        // Save tracking data to database
                        await saveTrackingData(anonymousId, utmParams);
                    } catch (error) {
                        console.error("Error capturing tracking data:", error);
                    }
                }
            }["TrackingProvider.useEffect.captureTrackingData"];
            captureTrackingData();
        }
    }["TrackingProvider.useEffect"], [
        pathname,
        searchParams
    ]);
    // Function to save tracking data to the database
    const saveTrackingData = async (anonymousId, utmParams)=>{
        try {
            // Check if user is authenticated
            const { data: { user } } = await supabase.auth.getUser();
            // Build tracking data object
            const trackingData = {
                anonymous_id: anonymousId,
                user_id: user?.id,
                utm_source: utmParams.utm_source,
                utm_medium: utmParams.utm_medium,
                utm_campaign: utmParams.utm_campaign,
                utm_term: utmParams.utm_term,
                utm_content: utmParams.utm_content,
                referrer: document.referrer || null,
                landing_page: window.location.href,
                first_visit: new Date().toISOString()
            };
            // Remove undefined values
            Object.keys(trackingData).forEach((key)=>{
                if (trackingData[key] === undefined) {
                    delete trackingData[key];
                }
            });
            // Save to database
            const { error } = await supabase.from("tracking_data").insert(trackingData);
            if (error && !error.message.includes("duplicate")) {
                console.error("Error saving tracking data:", error);
            }
        } catch (error) {
            console.error("Error saving tracking data:", error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(TrackingProvider, "jq/6JV7jSw8H7h1siyRMT4JsAUQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = TrackingProvider;
var _c;
__turbopack_context__.k.register(_c, "TrackingProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/internal/font/google/inter_59dee874.module.css [app-client] (css module)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v({
  "className": "inter_59dee874-module__9CtR0q__className",
});
}}),
"[next]/internal/font/google/inter_59dee874.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_59dee874.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}}),
"[project]/src/app/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>RootLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$TrackingProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/TrackingProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_59dee874.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        suppressHydrationWarning: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_59dee874$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].className,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$TrackingProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 19,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = RootLayout;
var _c;
__turbopack_context__.k.register(_c, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__a7594eec._.js.map