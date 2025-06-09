module.exports = {

"[project]/src/contexts/OnboardingContext.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "OnboardingProvider": (()=>OnboardingProvider),
    "useOnboarding": (()=>useOnboarding)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
// Initial state - simplified
const initialState = {
    step: 1,
    userType: null,
    referralSource: null
};
// Reducer - simplified
function onboardingReducer(state, action) {
    switch(action.type){
        case "NEXT_STEP":
            return {
                ...state,
                step: Math.min(state.step + 1, 4)
            }; // Changed max to 4
        case "PREV_STEP":
            return {
                ...state,
                step: Math.max(state.step - 1, 1)
            };
        case "SET_STEP":
            return {
                ...state,
                step: action.payload
            };
        case "SET_USER_TYPE":
            return {
                ...state,
                userType: action.payload
            };
        case "SET_REFERRAL_SOURCE":
            return {
                ...state,
                referralSource: action.payload
            };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}
// Context
const OnboardingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OnboardingProvider({ children }) {
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(onboardingReducer, initialState);
    const submitOnboarding = async (userId)=>{
        try {
            // Create FormData with simplified onboarding information
            const formData = new FormData();
            formData.append("userType", state.userType || "");
            formData.append("referralSource", state.referralSource || "");
            // Set default values for removed fields to maintain database compatibility
            formData.append("teamSize", ""); // No longer asked
            formData.append("audioPurpose", ""); // No longer asked
            formData.append("paymentCompleted", "true"); // Payment already completed
            formData.append("micPermission", "true"); // Default to true
            // Import the server action dynamically to avoid SSR issues
            const { completeOnboarding } = await __turbopack_context__.r("[project]/src/app/(auth)/onboarding/actions.ts [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i);
            // Call the server action
            const result = await completeOnboarding(formData);
            // Handle any errors returned from the server action
            if (result && "error" in result) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error submitting onboarding:", error);
            throw error;
        }
    };
    const value = {
        state,
        dispatch,
        submitOnboarding
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OnboardingContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/OnboardingContext.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
function useOnboarding() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(OnboardingContext);
    if (context === undefined) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}
}}),
"[project]/src/app/(auth)/onboarding/layout.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>OnboardingLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$OnboardingContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/OnboardingContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function OnboardingLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center min-h-screen overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$OnboardingContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OnboardingProvider"], {
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
}}),

};

//# sourceMappingURL=src_1e4cb215._.js.map