module.exports = {

"[project]/src/utils/supabase/server.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://wnxwqdupndeqijmamdkp.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHdxZHVwbmRlcWlqbWFtZGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDU4NTksImV4cCI6MjA0NzQyMTg1OX0.pJ2CF508xkmP2IPEoSkqJ45lMmNySVxHJYxeZ_Ge3Pw"));
}
}}),
"[project]/src/utils/tracking/server.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/utils/tracking/server.ts
__turbopack_context__.s({
    "ANONYMOUS_ID_COOKIE": (()=>ANONYMOUS_ID_COOKIE),
    "UTM_COOKIE_NAME": (()=>UTM_COOKIE_NAME),
    "VISIT_COOKIE_NAME": (()=>VISIT_COOKIE_NAME),
    "clearServerTrackingCookies": (()=>clearServerTrackingCookies),
    "getServerAnonymousId": (()=>getServerAnonymousId),
    "getServerTrackingData": (()=>getServerTrackingData),
    "getServerUTMData": (()=>getServerUTMData),
    "getServerVisitData": (()=>getServerVisitData),
    "getUserTrackingData": (()=>getUserTrackingData),
    "linkTrackingDataToUser": (()=>linkTrackingDataToUser),
    "saveUTMDataDuringOnboarding": (()=>saveUTMDataDuringOnboarding),
    "setServerAnonymousId": (()=>setServerAnonymousId),
    "setServerUTMData": (()=>setServerUTMData),
    "setServerVisitData": (()=>setServerVisitData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-ssr] (ecmascript)");
;
;
const UTM_COOKIE_NAME = "arti_utm_data";
const VISIT_COOKIE_NAME = "arti_visit_data";
const ANONYMOUS_ID_COOKIE = "arti_anonymous_id";
// Cookie settings
const COOKIE_OPTIONS = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    path: "/",
    sameSite: "lax",
    secure: ("TURBOPACK compile-time value", "development") === "production"
};
async function linkTrackingDataToUser(userId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        // Get anonymous ID from cookies
        const anonymousId = cookieStore.get(ANONYMOUS_ID_COOKIE)?.value;
        if (!anonymousId) {
            return;
        }
        // Update all tracking data records with this anonymous ID to link to the user
        await supabase.from("tracking_data").update({
            user_id: userId
        }).eq("anonymous_id", anonymousId).is("user_id", null);
    } catch (error) {
        console.error("Error linking tracking data to user:", error);
    }
}
async function getUserTrackingData(userId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("tracking_data").select("*").eq("user_id", userId).order("created_at", {
            ascending: false
        }).limit(1).single();
        if (error) {
            console.error("Error getting user tracking data:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error getting user tracking data:", error);
        return null;
    }
}
async function saveUTMDataDuringOnboarding(userId, onboardingId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
        // Get latest tracking data for the user
        const trackingData = await getUserTrackingData(userId);
        if (!trackingData) return;
        // Update onboarding record with UTM data
        await supabase.from("user_onboarding").update({
            tracking_data_id: trackingData.id,
            utm_source: trackingData.utm_source,
            utm_medium: trackingData.utm_medium,
            utm_campaign: trackingData.utm_campaign,
            referrer: trackingData.referrer
        }).eq("id", onboardingId);
    } catch (error) {
        console.error("Error saving UTM data during onboarding:", error);
    }
}
async function getServerUTMData() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        const utmData = cookieStore.get(UTM_COOKIE_NAME);
        return utmData ? JSON.parse(utmData.value) : null;
    } catch (error) {
        console.error("Error getting server UTM data:", error);
        return null;
    }
}
async function getServerVisitData() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        const visitData = cookieStore.get(VISIT_COOKIE_NAME);
        return visitData ? JSON.parse(visitData.value) : null;
    } catch (error) {
        console.error("Error getting server visit data:", error);
        return null;
    }
}
async function getServerAnonymousId() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        const anonymousId = cookieStore.get(ANONYMOUS_ID_COOKIE);
        return anonymousId ? anonymousId.value : null;
    } catch (error) {
        console.error("Error getting server anonymous ID:", error);
        return null;
    }
}
async function getServerTrackingData() {
    const [utmData, visitData, anonymousId] = await Promise.all([
        getServerUTMData(),
        getServerVisitData(),
        getServerAnonymousId()
    ]);
    return {
        utmData,
        visitData,
        anonymousId
    };
}
async function setServerUTMData(data) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set(UTM_COOKIE_NAME, JSON.stringify(data), COOKIE_OPTIONS);
    } catch (error) {
        console.error("Error setting server UTM data:", error);
    }
}
async function setServerVisitData(data) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set(VISIT_COOKIE_NAME, JSON.stringify(data), COOKIE_OPTIONS);
    } catch (error) {
        console.error("Error setting server visit data:", error);
    }
}
async function setServerAnonymousId(id) {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set(ANONYMOUS_ID_COOKIE, id, {
            ...COOKIE_OPTIONS,
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });
    } catch (error) {
        console.error("Error setting server anonymous ID:", error);
    }
}
async function clearServerTrackingCookies() {
    try {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.delete(UTM_COOKIE_NAME);
        cookieStore.delete(VISIT_COOKIE_NAME);
        cookieStore.delete(ANONYMOUS_ID_COOKIE);
    } catch (error) {
        console.error("Error clearing server tracking cookies:", error);
    }
}
}}),

};

//# sourceMappingURL=src_utils_b26be8d4._.js.map