(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_00a8d40b._.js", {

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
"[project]/src/contexts/OnboardingContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "OnboardingProvider": (()=>OnboardingProvider),
    "useOnboarding": (()=>useOnboarding)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const initialState = {
    step: 1,
    userType: null,
    teamSize: null,
    referralSource: null,
    audioPurpose: null,
    micPermission: null,
    paymentCompleted: null
};
const OnboardingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const onboardingReducer = (state, action)=>{
    switch(action.type){
        case "NEXT_STEP":
            return {
                ...state,
                step: state.step + 1
            };
        case "PREV_STEP":
            return {
                ...state,
                step: Math.max(1, state.step - 1)
            };
        case "SET_USER_TYPE":
            return {
                ...state,
                userType: action.payload
            };
        case "SET_TEAM_SIZE":
            return {
                ...state,
                teamSize: action.payload
            };
        case "SET_REFERRAL_SOURCE":
            return {
                ...state,
                referralSource: action.payload
            };
        case "SET_AUDIO_PURPOSE":
            return {
                ...state,
                audioPurpose: action.payload
            };
        case "SET_MIC_PERMISSION":
            return {
                ...state,
                micPermission: action.payload
            };
        case "SET_PAYMENT_COMPLETED":
            return {
                ...state,
                paymentCompleted: action.payload
            };
        case "RESET":
            return initialState;
        default:
            return state;
    }
};
const OnboardingProvider = ({ children })=>{
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(onboardingReducer, initialState);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const requestMicPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OnboardingProvider.useCallback[requestMicPermission]": async ()=>{
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Browser does not support media devices");
                }
                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                // Stop all tracks immediately after permission is granted
                stream.getTracks().forEach({
                    "OnboardingProvider.useCallback[requestMicPermission]": (track)=>track.stop()
                }["OnboardingProvider.useCallback[requestMicPermission]"]);
                dispatch({
                    type: "SET_MIC_PERMISSION",
                    payload: true
                });
                return true;
            } catch (error) {
                console.error("Error requesting microphone permission:", error);
                dispatch({
                    type: "SET_MIC_PERMISSION",
                    payload: false
                });
                return false;
            }
        }
    }["OnboardingProvider.useCallback[requestMicPermission]"], []);
    const submitOnboarding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OnboardingProvider.useCallback[submitOnboarding]": async (userId)=>{
            try {
                if (!state.userType || !state.teamSize || !state.referralSource || !state.audioPurpose || !state.paymentCompleted) {
                    throw new Error("Missing required onboarding information");
                }
                const onboardingData = {
                    userId,
                    userType: state.userType,
                    teamSize: state.teamSize,
                    referralSource: state.referralSource,
                    audioPurpose: state.audioPurpose,
                    micPermission: state.micPermission ?? false,
                    paymentCompleted: state.paymentCompleted
                };
                // Get UTM data from cookies if available
                let utmData = {};
                try {
                    if ("TURBOPACK compile-time truthy", 1) {
                        // Dynamically import to avoid SSR issues
                        const { getAllTrackingData } = await __turbopack_context__.r("[project]/src/utils/tracking/utm.ts [app-client] (ecmascript, async loader)")(__turbopack_context__.i);
                        utmData = await getAllTrackingData();
                    }
                } catch (err) {
                    console.error("Error getting UTM data:", err);
                }
                // Save onboarding data to Supabase
                const { data, error } = await supabase.from("user_onboarding").upsert({
                    user_id: userId,
                    user_type: onboardingData.userType,
                    team_size: onboardingData.teamSize,
                    referral_source: onboardingData.referralSource,
                    audio_purpose: onboardingData.audioPurpose,
                    mic_permission: onboardingData.micPermission,
                    payment_completed: onboardingData.paymentCompleted,
                    utm_source: utmData.utm_source || null,
                    utm_medium: utmData.utm_medium || null,
                    utm_campaign: utmData.utm_campaign || null,
                    referrer: utmData.referrer || null,
                    completed_at: new Date().toISOString()
                }).select("id").single();
                if (error) throw error;
                if (data?.id) {
                    // Link tracking data to onboarding data
                    try {
                        // Dynamically import server utility
                        const { saveUTMDataDuringOnboarding } = await __turbopack_context__.r("[project]/src/utils/tracking/server.ts [app-client] (ecmascript, async loader)")(__turbopack_context__.i);
                        await saveUTMDataDuringOnboarding(userId, data.id);
                    } catch (err) {
                        console.error("Error linking tracking data:", err);
                    // Non-fatal error, continue
                    }
                }
                // Reset the state after successful submission
                dispatch({
                    type: "RESET"
                });
            } catch (error) {
                console.error("Error submitting onboarding data:", error);
                throw error;
            }
        }
    }["OnboardingProvider.useCallback[submitOnboarding]"], [
        state,
        supabase
    ]);
    const value = {
        state,
        dispatch,
        submitOnboarding,
        requestMicPermission
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OnboardingContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/OnboardingContext.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
};
_s(OnboardingProvider, "L4YYDr6EhY1SniUPUCzqxhqnKm4=");
_c = OnboardingProvider;
const useOnboarding = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
};
_s1(useOnboarding, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "OnboardingProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/(auth)/onboarding/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>OnboardingLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$OnboardingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/OnboardingContext.tsx [app-client] (ecmascript)");
"use client";
;
;
function OnboardingLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center min-h-screen overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$OnboardingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/(auth)/onboarding/layout.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(auth)/onboarding/layout.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = OnboardingLayout;
var _c;
__turbopack_context__.k.register(_c, "OnboardingLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_00a8d40b._.js.map