"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function SessionDebugPage() {
  const { user } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}`;
    console.log(logMessage);
    setLogs((prev) => [...prev, logMessage]);
  };

  useEffect(() => {
    const checkSession = async () => {
      addLog("=== SESSION DEBUG PAGE INIT ===");
      const supabase = createClient();

      // Check auth context
      addLog(`Auth Context User: ${user ? user.id : "null"}`);
      addLog(`Auth Context Email: ${user ? user.email : "null"}`);

      // Check session
      addLog("Checking session...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      addLog(`Session Result:`);
      addLog(`- Has Session: ${!!session}`);
      addLog(`- Session Error: ${sessionError?.message || "none"}`);

      if (session) {
        addLog(`- User ID: ${session.user.id}`);
        addLog(`- Email: ${session.user.email}`);
        addLog(`- Email Confirmed: ${session.user.email_confirmed_at}`);
        addLog(
          `- Access Token: ${session.access_token ? "present" : "missing"}`
        );
        addLog(
          `- Refresh Token: ${session.refresh_token ? "present" : "missing"}`
        );
        addLog(`- Expires At: ${session.expires_at}`);

        setSessionInfo({
          user_id: session.user.id,
          email: session.user.email,
          email_confirmed_at: session.user.email_confirmed_at,
          created_at: session.user.created_at,
          expires_at: session.expires_at,
          has_access_token: !!session.access_token,
          has_refresh_token: !!session.refresh_token,
        });
      }

      // Check user directly
      addLog("Checking user directly...");
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      addLog(`User Result:`);
      addLog(`- Has User: ${!!userData.user}`);
      addLog(`- User Error: ${userError?.message || "none"}`);

      if (userData.user) {
        addLog(`- User ID: ${userData.user.id}`);
        addLog(`- Email: ${userData.user.email}`);

        setUserInfo({
          id: userData.user.id,
          email: userData.user.email,
          email_confirmed_at: userData.user.email_confirmed_at,
          created_at: userData.user.created_at,
        });
      }

      // Check cookies
      const cookies = document.cookie;
      const authCookies = cookies
        .split(";")
        .filter(
          (cookie) =>
            cookie.trim().startsWith("sb-") || cookie.trim().includes("auth")
        );
      addLog(`Auth Cookies: ${authCookies.length} found`);
      authCookies.forEach((cookie, index) => {
        addLog(`  Cookie ${index + 1}: ${cookie.trim().substring(0, 50)}...`);
      });

      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`=== AUTH STATE CHANGE: ${event} ===`);
      if (session) {
        addLog(`New session user: ${session.user.id}`);
        setSessionInfo({
          user_id: session.user.id,
          email: session.user.email,
          email_confirmed_at: session.user.email_confirmed_at,
          created_at: session.user.created_at,
          expires_at: session.expires_at,
          has_access_token: !!session.access_token,
          has_refresh_token: !!session.refresh_token,
        });
      } else {
        addLog("Session cleared");
        setSessionInfo(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const refreshSession = async () => {
    addLog("=== MANUAL SESSION REFRESH ===");
    const supabase = createClient();
    const { data, error } = await supabase.auth.refreshSession();

    addLog(
      `Refresh result: ${!!data.session}, error: ${error?.message || "none"}`
    );

    if (data.session) {
      setSessionInfo({
        user_id: data.session.user.id,
        email: data.session.user.email,
        email_confirmed_at: data.session.user.email_confirmed_at,
        created_at: data.session.user.created_at,
        expires_at: data.session.expires_at,
        has_access_token: !!data.session.access_token,
        has_refresh_token: !!data.session.refresh_token,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading session information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Session Debug Page</h1>
          <p className="text-gray-400 mt-2">Check your authentication status</p>
        </div>

        {/* Session Information */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            Session Information
          </h2>
          {sessionInfo ? (
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">User ID:</span>{" "}
                {sessionInfo.user_id}
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{" "}
                {sessionInfo.email}
              </p>
              <p>
                <span className="text-gray-400">Email Confirmed:</span>{" "}
                {sessionInfo.email_confirmed_at || "Not confirmed"}
              </p>
              <p>
                <span className="text-gray-400">Created:</span>{" "}
                {sessionInfo.created_at}
              </p>
              <p>
                <span className="text-gray-400">Expires:</span>{" "}
                {new Date(sessionInfo.expires_at * 1000).toLocaleString()}
              </p>
              <p>
                <span className="text-gray-400">Access Token:</span>{" "}
                {sessionInfo.has_access_token ? "✅ Present" : "❌ Missing"}
              </p>
              <p>
                <span className="text-gray-400">Refresh Token:</span>{" "}
                {sessionInfo.has_refresh_token ? "✅ Present" : "❌ Missing"}
              </p>
            </div>
          ) : (
            <p className="text-red-400">❌ No session found</p>
          )}
        </div>

        {/* User Information */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            User Information
          </h2>
          {userInfo ? (
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">User ID:</span> {userInfo.id}
              </p>
              <p>
                <span className="text-gray-400">Email:</span> {userInfo.email}
              </p>
              <p>
                <span className="text-gray-400">Email Confirmed:</span>{" "}
                {userInfo.email_confirmed_at || "Not confirmed"}
              </p>
              <p>
                <span className="text-gray-400">Created:</span>{" "}
                {userInfo.created_at}
              </p>
            </div>
          ) : (
            <p className="text-red-400">❌ No user found</p>
          )}
        </div>

        {/* Auth Context */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            Auth Context
          </h2>
          {user ? (
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">User ID:</span> {user.id}
              </p>
              <p>
                <span className="text-gray-400">Email:</span> {user.email}
              </p>
            </div>
          ) : (
            <p className="text-red-400">❌ No auth context user</p>
          )}
        </div>

        {/* Debug Logs */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            Debug Logs
          </h2>
          <div className="bg-black p-4 rounded max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-300 font-mono mb-1">
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={refreshSession}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Session
          </button>

          <button
            onClick={() => setLogs([])}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>

          <a
            href={`https://buy.stripe.com/test_fZufZhb5M5uY57l9xlak003${
              user?.email
                ? `?prefilled_email=${encodeURIComponent(user.email)}`
                : ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 inline-block text-center"
          >
            Test Payment Link
          </a>

          <Link
            href="/payment"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Payment
          </Link>

          <Link
            href="/sign-up"
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
