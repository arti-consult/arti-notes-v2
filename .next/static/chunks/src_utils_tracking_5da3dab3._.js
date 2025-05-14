(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_utils_tracking_5da3dab3._.js", {

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
async function captureUTMParameters(searchParamsString) {
    try {
        // If we have a search params string, parse it directly
        if (searchParamsString) {
            const searchParams = new URLSearchParams(searchParamsString);
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
        }
        // If no search params string provided, use current window URL
        if ("TURBOPACK compile-time truthy", 1) {
            const currentUrl = window.location.href;
            const urlObj = new URL(currentUrl);
            // Extract UTM parameters
            const utmParams = {
                utm_source: urlObj.searchParams.get("utm_source") || undefined,
                utm_medium: urlObj.searchParams.get("utm_medium") || undefined,
                utm_campaign: urlObj.searchParams.get("utm_campaign") || undefined,
                utm_term: urlObj.searchParams.get("utm_term") || undefined,
                utm_content: urlObj.searchParams.get("utm_content") || undefined
            };
            // Only save if at least one UTM parameter is present
            if (Object.values(utmParams).some((value)=>value)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$tracking$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setClientUTMData"])(utmParams);
            }
            return utmParams;
        }
        "TURBOPACK unreachable";
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
}]);

//# sourceMappingURL=src_utils_tracking_5da3dab3._.js.map