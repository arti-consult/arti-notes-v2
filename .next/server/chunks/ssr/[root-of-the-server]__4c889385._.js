module.exports = {

"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createClient": (()=>createClient)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://wnxwqdupndeqijmamdkp.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHdxZHVwbmRlcWlqbWFtZGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NDU4NTksImV4cCI6MjA0NzQyMTg1OX0.pJ2CF508xkmP2IPEoSkqJ45lMmNySVxHJYxeZ_Ge3Pw"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                cookieStore.set({
                    name,
                    value,
                    ...options
                });
            },
            remove (name, options) {
                cookieStore.set({
                    name,
                    value: "",
                    ...options
                });
            }
        }
    });
}
}}),
"[project]/src/utils/tracking/constants.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/utils/tracking/constants.ts
// Cookie names
__turbopack_context__.s({
    "ANONYMOUS_ID_COOKIE": (()=>ANONYMOUS_ID_COOKIE),
    "COOKIE_OPTIONS": (()=>COOKIE_OPTIONS),
    "UTM_COOKIE_NAME": (()=>UTM_COOKIE_NAME),
    "VISIT_COOKIE_NAME": (()=>VISIT_COOKIE_NAME)
});
const UTM_COOKIE_NAME = "arti_utm_data";
const VISIT_COOKIE_NAME = "arti_visit_data";
const ANONYMOUS_ID_COOKIE = "arti_anonymous_id";
const COOKIE_OPTIONS = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    path: "/",
    sameSite: "lax",
    secure: ("TURBOPACK compile-time value", "development") === "production"
};
}}),
"[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00088a749312c45a915036e6598fd678ed3ec5a46a":"getServerUTMData","00237d5a0948aafbfd9347a0e126db690538f4a91b":"getServerTrackingData","0047669ca0c477a8ff7d0bcb81bc72c873efcddb56":"clearServerTrackingCookies","00a89c8077261bbdce3b6b27cac9700c2137b45daa":"getServerAnonymousId","00b2ff056e81e3de5a14482d74deebc03e6d20ec83":"getServerVisitData","407534cea092bdf2b90d5ab59c0fcffd3f1c56cbbc":"getUserTrackingData","408609e61d2f7c8f0cbf6636c854c7cee41b933309":"setServerUTMData","40b2bf7ee2d63442ae3d2aa4c95aeeb7fb662f60b7":"linkTrackingDataToUser","40c395d268949360ffae61d2b892442c162cb9de73":"setServerAnonymousId","40f5b8ae32928f33cd724014cb056c4c129f043559":"setServerVisitData","603ed09994efc8b1d4fbf153f83a11cc7bc3bbc10b":"saveUTMDataDuringOnboarding"},"",""] */ __turbopack_context__.s({
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
// src/utils/tracking/server.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
/**
 * Get cookie store, handling both Pages Router and App Router
 */ async function getCookieStore() {
    const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore instanceof Promise ? await cookieStore : cookieStore;
}
async function linkTrackingDataToUser(userId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const cookieStore = await getCookieStore();
        // Get anonymous ID from cookies
        const anonymousId = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"])?.value;
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const cookieStore = await getCookieStore();
        const utmData = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UTM_COOKIE_NAME"]);
        return utmData ? JSON.parse(utmData.value) : null;
    } catch (error) {
        console.error("Error getting server UTM data:", error);
        return null;
    }
}
async function getServerVisitData() {
    try {
        const cookieStore = await getCookieStore();
        const visitData = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIT_COOKIE_NAME"]);
        return visitData ? JSON.parse(visitData.value) : null;
    } catch (error) {
        console.error("Error getting server visit data:", error);
        return null;
    }
}
async function getServerAnonymousId() {
    try {
        const cookieStore = await getCookieStore();
        const anonymousId = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"]);
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
        const cookieStore = await getCookieStore();
        cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UTM_COOKIE_NAME"], JSON.stringify(data), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_OPTIONS"]);
    } catch (error) {
        console.error("Error setting server UTM data:", error);
    }
}
async function setServerVisitData(data) {
    try {
        const cookieStore = await getCookieStore();
        cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIT_COOKIE_NAME"], JSON.stringify(data), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_OPTIONS"]);
    } catch (error) {
        console.error("Error setting server visit data:", error);
    }
}
async function setServerAnonymousId(id) {
    try {
        const cookieStore = await getCookieStore();
        cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"], id, {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COOKIE_OPTIONS"],
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });
    } catch (error) {
        console.error("Error setting server anonymous ID:", error);
    }
}
async function clearServerTrackingCookies() {
    try {
        const cookieStore = await getCookieStore();
        cookieStore.delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UTM_COOKIE_NAME"]);
        cookieStore.delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIT_COOKIE_NAME"]);
        cookieStore.delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ANONYMOUS_ID_COOKIE"]);
    } catch (error) {
        console.error("Error clearing server tracking cookies:", error);
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    linkTrackingDataToUser,
    getUserTrackingData,
    saveUTMDataDuringOnboarding,
    getServerUTMData,
    getServerVisitData,
    getServerAnonymousId,
    getServerTrackingData,
    setServerUTMData,
    setServerVisitData,
    setServerAnonymousId,
    clearServerTrackingCookies
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(linkTrackingDataToUser, "40b2bf7ee2d63442ae3d2aa4c95aeeb7fb662f60b7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserTrackingData, "407534cea092bdf2b90d5ab59c0fcffd3f1c56cbbc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveUTMDataDuringOnboarding, "603ed09994efc8b1d4fbf153f83a11cc7bc3bbc10b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServerUTMData, "00088a749312c45a915036e6598fd678ed3ec5a46a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServerVisitData, "00b2ff056e81e3de5a14482d74deebc03e6d20ec83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServerAnonymousId, "00a89c8077261bbdce3b6b27cac9700c2137b45daa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getServerTrackingData, "00237d5a0948aafbfd9347a0e126db690538f4a91b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setServerUTMData, "408609e61d2f7c8f0cbf6636c854c7cee41b933309", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setServerVisitData, "40f5b8ae32928f33cd724014cb056c4c129f043559", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setServerAnonymousId, "40c395d268949360ffae61d2b892442c162cb9de73", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(clearServerTrackingCookies, "0047669ca0c477a8ff7d0bcb81bc72c873efcddb56", null);
}}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00088a749312c45a915036e6598fd678ed3ec5a46a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerUTMData"]),
    "00237d5a0948aafbfd9347a0e126db690538f4a91b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerTrackingData"]),
    "0047669ca0c477a8ff7d0bcb81bc72c873efcddb56": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clearServerTrackingCookies"]),
    "00a89c8077261bbdce3b6b27cac9700c2137b45daa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerAnonymousId"]),
    "00b2ff056e81e3de5a14482d74deebc03e6d20ec83": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerVisitData"]),
    "407534cea092bdf2b90d5ab59c0fcffd3f1c56cbbc": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserTrackingData"]),
    "408609e61d2f7c8f0cbf6636c854c7cee41b933309": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setServerUTMData"]),
    "40b2bf7ee2d63442ae3d2aa4c95aeeb7fb662f60b7": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["linkTrackingDataToUser"]),
    "40c395d268949360ffae61d2b892442c162cb9de73": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setServerAnonymousId"]),
    "40f5b8ae32928f33cd724014cb056c4c129f043559": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setServerVisitData"]),
    "603ed09994efc8b1d4fbf153f83a11cc7bc3bbc10b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveUTMDataDuringOnboarding"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00088a749312c45a915036e6598fd678ed3ec5a46a": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00088a749312c45a915036e6598fd678ed3ec5a46a"]),
    "00237d5a0948aafbfd9347a0e126db690538f4a91b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00237d5a0948aafbfd9347a0e126db690538f4a91b"]),
    "0047669ca0c477a8ff7d0bcb81bc72c873efcddb56": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0047669ca0c477a8ff7d0bcb81bc72c873efcddb56"]),
    "00a89c8077261bbdce3b6b27cac9700c2137b45daa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00a89c8077261bbdce3b6b27cac9700c2137b45daa"]),
    "00b2ff056e81e3de5a14482d74deebc03e6d20ec83": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00b2ff056e81e3de5a14482d74deebc03e6d20ec83"]),
    "407534cea092bdf2b90d5ab59c0fcffd3f1c56cbbc": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["407534cea092bdf2b90d5ab59c0fcffd3f1c56cbbc"]),
    "408609e61d2f7c8f0cbf6636c854c7cee41b933309": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["408609e61d2f7c8f0cbf6636c854c7cee41b933309"]),
    "40b2bf7ee2d63442ae3d2aa4c95aeeb7fb662f60b7": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40b2bf7ee2d63442ae3d2aa4c95aeeb7fb662f60b7"]),
    "40c395d268949360ffae61d2b892442c162cb9de73": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40c395d268949360ffae61d2b892442c162cb9de73"]),
    "40f5b8ae32928f33cd724014cb056c4c129f043559": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40f5b8ae32928f33cd724014cb056c4c129f043559"]),
    "603ed09994efc8b1d4fbf153f83a11cc7bc3bbc10b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["603ed09994efc8b1d4fbf153f83a11cc7bc3bbc10b"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$utils$2f$tracking$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/src/utils/tracking/server.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/dashboard/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/dashboard/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/dashboard/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/dashboard/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/dashboard/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/dashboard/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/dashboard/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/dashboard/page.tsx", "default");
}}),
"[project]/src/app/dashboard/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/dashboard/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/dashboard/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$dashboard$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/dashboard/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/dashboard/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__4c889385._.js.map