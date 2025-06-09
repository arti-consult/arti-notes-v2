"use client";

import { signup, signInWithGoogle, signInWithMicrosoft } from "./actions";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function SignUpFormContent() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Only check session once when component mounts
    const checkInitialSession = async () => {
      console.log("SignUp: Checking initial session...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return;
      }

      if (session?.user?.email_confirmed_at) {
        console.log(
          "SignUp: User already has confirmed session, letting middleware handle redirect"
        );
        // Don't manually redirect here - let the middleware handle it
        // The middleware will redirect based on onboarding status
      }
    };

    checkInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("SignUp: Auth state changed:", {
        event,
        hasSession: !!session,
      });

      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        console.log(
          "SignUp: User signed in, triggering page refresh to let middleware redirect"
        );
        // Instead of manually redirecting, refresh the page to trigger middleware
        window.location.reload();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!isMounted) {
    return null;
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("SignUp: Starting Google sign up");
      await signInWithGoogle();
    } catch (error) {
      console.error("SignUp: Google sign up error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during Google sign-up"
      );
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.8 }}
        className="absolute w-[1200px] h-[1200px] bg-[#145DFC] rounded-full blur-[256px]"
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md p-8 space-y-8 bg-[#18181B] rounded-xl shadow-lg relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">Join us to get started</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
              {error.includes("already exists") && (
                <div className="mt-2">
                  <Link
                    href="/login"
                    className="text-red-200 hover:text-red-100 underline"
                  >
                    Sign in instead
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          action={async (formData) => {
            console.log("SignUp: Form submission started");
            setIsLoading(true);
            setError(null);

            const result = await signup(formData);
            console.log("SignUp: Form submission result:", result);

            if (result?.error) {
              setError(result.error);
              setIsLoading(false);
            }
            // If successful, the server action will redirect
            // Don't set loading to false for successful cases
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#145DFC] focus:border-[#145DFC] text-white transition-colors duration-200 disabled:opacity-50"
              />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#145DFC] focus:border-[#145DFC] text-white transition-colors duration-200 disabled:opacity-50"
              />
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#145DFC] focus:border-[#145DFC] text-white transition-colors duration-200 disabled:opacity-50"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center"
          >
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              disabled={isLoading}
              className="h-4 w-4 text-[#145DFC] focus:ring-[#145DFC] border-gray-700 rounded bg-black disabled:opacity-50"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-white">
              I agree to the{" "}
              <a
                href="#"
                className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </label>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#145DFC] hover:bg-[#145DFC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#145DFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="text-center"
          >
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#145DFC] hover:text-[#145DFC]/90 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-6"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#18181B] text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-black text-sm font-medium text-gray-300 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaGoogle className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => signInWithMicrosoft()}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-black text-sm font-medium text-gray-300 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaMicrosoft className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function SignUpFormFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-black relative"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.8 }}
        className="absolute w-[1200px] h-[1200px] bg-[#145DFC] rounded-full blur-[256px]"
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-[#18181B] rounded-xl shadow-lg relative z-10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">Loading...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpFormFallback />}>
      <SignUpFormContent />
    </Suspense>
  );
}
