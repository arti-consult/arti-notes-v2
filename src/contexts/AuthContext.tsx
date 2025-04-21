// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Subscription, PricingPlan } from "@/types/subscription";
import { Profile } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  subscription: Subscription | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  subscription: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Link anonymous tracking data to the user
          try {
            // Dynamic import to avoid issues with SSR
            const { linkTrackingDataToUser } = await import(
              "@/utils/tracking/server"
            );
            await linkTrackingDataToUser(session.user.id);
          } catch (err) {
            // Non-fatal error
            console.error("Error linking tracking data:", err);
          }

          // Get profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setProfile(profileData);

          // Get active subscription
          const { data: subscriptionData } = await supabase
            .from("subscriptions")
            .select(
              `
              *,
              plan:pricing_plans(*)
            `
            )
            .eq("user_id", session.user.id)
            .eq("status", "active")
            .single();

          if (subscriptionData) {
            // Format the subscription data
            setSubscription({
              ...subscriptionData,
              plan: subscriptionData.plan as PricingPlan,
            });
          } else {
            setSubscription(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (session) {
        fetchUserData();
      } else {
        setProfile(null);
        setSubscription(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const value = {
    user,
    profile,
    session,
    subscription,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
